from modal import Image, Stub, asgi_app, Secret
from langchain import OpenAI, SQLDatabase
from langchain.agents import create_sql_agent
from langchain.agents import AgentType
from langchain.callbacks import get_openai_callback
from langchain.agents.agent_toolkits.base import BaseToolkit
from langchain.base_language import BaseLanguageModel
from langchain.sql_database import SQLDatabase
from langchain.tools import BaseTool
from langchain.tools.sql_database.tool import (
    InfoSQLDatabaseTool,
    ListSQLDatabaseTool,
    QuerySQLCheckerTool,
    QuerySQLDataBaseTool,
)
from typing import List, Optional
from pydantic import Field, BaseModel, Extra
from langchain.base_language import BaseLanguageModel
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain.sql_database import SQLDatabase
from langchain.tools.base import BaseTool
from langchain.chat_models import ChatOpenAI
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlparse
import io
import logging
import requests

# Create Stub and FastAPI instances.
stub = Stub('db-agent-api')
web_app = FastAPI()

# Create a new logger and set its level.
logger = logging.getLogger('agent_executor')
logger.setLevel(logging.INFO)

# Create a string buffer and set up a stream handler to write into it.
log_output = io.StringIO()
stream_handler = logging.StreamHandler(log_output)

# Format the logs in the stream handler to be written as strings.
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
stream_handler.setFormatter(formatter)

# Add the stream handler to your logger.
logger.addHandler(stream_handler)

# Define the Image we will use. 
image = Image.debian_slim().pip_install(
    ['openai', 'pydantic', 'fastapi', 'sqlparse', 'requests','langchain', 'sqlalchemy', 'psycopg2-binary']
)

web_app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@stub.function(secret=Secret.from_name("basis-theory-key"))
def get_basis_theory_key():
    return 'key_QuRA9fbFiMu7fEHqeKgyFa'

@stub.function(secret=Secret.from_name("my-openai-secret"))
def get_openai_api_key():
    return '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'

def _is_allowed_query(query: str) -> bool:
    """
    Helper function to check if the SQL query is an allowed query.
    Only allows SELECT, SHOW, DESCRIBE, EXPLAIN, and HELP statements.
    """
    allowed_statements = ['SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN', 'HELP']
    parsed = sqlparse.parse(query)
    for statement in parsed:
        if statement.get_type().upper() not in allowed_statements:
            return False
    return True


class BaseSQLDatabaseTool(BaseModel):
    """
    Base tool for interacting with a SQL database.
    """
    db: SQLDatabase = Field(exclude=True)

    # Override BaseTool.Config to appease mypy.
    class Config(BaseTool.Config):
        """Configuration for this pydantic object."""
        arbitrary_types_allowed = True
        extra = Extra.forbid


class QuerySQLDataBaseTool(BaseSQLDatabaseTool, BaseTool):
    """
    Tool for querying a SQL database.
    """
    name = "sql_db_query"
    description = (
        "Input to this tool is a detailed and correct SQL query, "
        "output is a result from the database. If the query is not correct, "
        "an error message will be returned."
    )

    def _run(
        self,
        query: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        """
        Execute the query, return the results or an error message.
        Only allowed query statements are executed.
        """
        if _is_allowed_query(query):
            return self.db.run_no_throw(query)
        else:
            return "Error: The AI is now allowed to do queries that can modify the database."

    async def _arun(
        self,
        query: str,
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        raise NotImplementedError("QuerySqlDbTool does not support async")


class ReadOnlySQLDatabaseToolkit(BaseToolkit):
    """
    Toolkit for interacting with SQL databases in read-only mode.
    """
    db: SQLDatabase = Field(exclude=True)
    llm: BaseLanguageModel = Field(exclude=True)

    @property
    def dialect(self) -> str:
        """Return string representation of dialect to use."""
        return self.db.dialect

    class Config:
        """Configuration for this pydantic object."""
        arbitrary_types_allowed = True

    def get_tools(self) -> List[BaseTool]:
        """
        Get the tools in the toolkit.
        """
        query_sql_database_tool_description = (
            "Input to this tool is a detailed and correct SQL query, output is a "
            "result from the database. If the query is not correct, an error message "
            "will be returned. If an error is returned, rewrite the query, check the "
            "query, and try again."
        )

        info_sql_database_tool_description = (
            "Input to this tool is a comma-separated list of tables, output is the "
            "schema and sample rows for those tables."
        )
        return [
            QuerySQLDataBaseTool(
                db=self.db, description=query_sql_database_tool_description
            ),
            InfoSQLDatabaseTool(
                db=self.db, description=info_sql_database_tool_description
            ),
            ListSQLDatabaseTool(db=self.db),
            QuerySQLCheckerTool(db=self.db, llm=self.llm),
        ]


# Create language model instance.
llm = ChatOpenAI(
    temperature=0,
    model="gpt-3.5-turbo-0613",
    openai_api_key=get_openai_api_key()
)

class QueryInput(BaseModel):
    """Model for the query input."""
    query: str
    token: str


class QueryOutput(BaseModel):
    """Model for the query output."""
    total_tokens: int
    prompt_tokens: int
    completion_tokens: int
    total_cost: float
    result: str


@web_app.post("/chat_query", response_model=QueryOutput)
async def run_query(query_input: QueryInput):
    """
    FastAPI endpoint to run the SQL query.
    """
    
    try:
        # Make a request to the Basis Theory API to get the token data
        response = requests.get(
            f"https://api.basistheory.com/tokens/{query_input.token}",
            headers={"BT-API-KEY": get_basis_theory_key()},
        )

        # Check the response status
        response.raise_for_status()

        # Extract token data
        token_data = response.json()["data"]
                
        # Initialize SQLDatabase, Toolkit, and AgentExecutor instances.
        db = SQLDatabase.from_uri(
            database_uri=token_data.replace("postgres://", "postgresql://")
        )
        
        toolkit = ReadOnlySQLDatabaseToolkit(
            db=db,
            llm=OpenAI(model='gpt-4-0613', temperature=0, openai_api_key=get_openai_api_key())
        )
        agent_executor = create_sql_agent(
            llm=llm,
            toolkit=toolkit,
            verbose=True,
            agent_type=AgentType.OPENAI_FUNCTIONS,
            return_sql=True
        )
        
        # Execute the query.
        prompt = query_input.query
        with get_openai_callback() as cb:
            result = agent_executor({"input": prompt})
            return QueryOutput(
                total_tokens=cb.total_tokens,
                prompt_tokens=cb.prompt_tokens,
                completion_tokens=cb.completion_tokens,
                total_cost=cb.total_cost,
                result=result["output"],
            )
    except Exception:
        return HTTPException(500, "LLM Error")

@stub.function(image=image)
@asgi_app()
def fastapi_app():
    """
    ASGI application that returns the FastAPI instance.
    """
    return web_app
