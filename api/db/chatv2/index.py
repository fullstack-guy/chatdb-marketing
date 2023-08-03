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
from fastapi import FastAPI
from pydantic import BaseModel
import sqlparse

def _is_allowed_query(query: str) -> bool:
    """Check if the SQL query is an allowed query."""
    allowed_statements = ['SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN', 'HELP']
    parsed = sqlparse.parse(query)
    for statement in parsed:
        if statement.get_type().upper() not in allowed_statements:
            return False
    return True

class BaseSQLDatabaseTool(BaseModel):
    """Base tool for interacting with a SQL database."""

    db: SQLDatabase = Field(exclude=True)

    # Override BaseTool.Config to appease mypy
    # See https://github.com/pydantic/pydantic/issues/4173
    class Config(BaseTool.Config):
        """Configuration for this pydantic object."""

        arbitrary_types_allowed = True
        extra = Extra.forbid
        
class QuerySQLDataBaseTool(BaseSQLDatabaseTool, BaseTool):
    """Tool for querying a SQL database."""

    name = "sql_db_query"
    description = """
    Input to this tool is a detailed and correct SQL query, output is a result from the database.
    If the query is not correct, an error message will be returned.
    If an error is returned, rewrite the query, check the query, and try again.
    """

    def _run(
        self,
        query: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        """Execute the query, return the results or an error message."""
        # Ensure the query is a allowed query statement
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
    """Toolkit for interacting with SQL databases in read-only mode."""

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
        """Get the tools in the toolkit."""
        query_sql_database_tool_description = (
            "Input to this tool is a detailed and correct SQL query, output is a "
            "result from the database. If the query is not correct, an error message "
            "will be returned. If an error is returned, rewrite the query, check the "
            "query, and try again. If you encounter an issue with Unknown column "
            "'xxxx' in 'field list', use schema_sql_db to query the correct table "
            "fields."
        )

        info_sql_database_tool_description = (
            "Input to this tool is a comma-separated list of tables, output is the "
            "schema and sample rows for those tables. "
            "Be sure that the tables actually exist by calling list_tables_sql_db "
            "first! Example Input: 'table1, table2, table3'"
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
        
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-0613", openai_api_key="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")

app = FastAPI()

class QueryInput(BaseModel):
    query: str

class QueryOutput(BaseModel):
    total_tokens: int
    prompt_tokens: int
    completion_tokens: int
    total_cost: float
    result: str


@app.post("/query", response_model=QueryOutput)
async def run_query(query_input: QueryInput):
    db = SQLDatabase.from_uri("postgresql://postgres:ArchLinux2018!!@db.lxgoynnprrciqexsbole.supabase.co:5432/postgres")
    toolkit = ReadOnlySQLDatabaseToolkit(db=db, llm=OpenAI(temperature=0, openai_api_key="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"))
    agent_executor = create_sql_agent(llm=llm, toolkit=toolkit, verbose=True, agent_type=AgentType.OPENAI_FUNCTIONS, return_sql=True)

    prompt = query_input.query
    with get_openai_callback() as cb:
        result = agent_executor.run(prompt)
        return QueryOutput(
            total_tokens=cb.total_tokens,
            prompt_tokens=cb.prompt_tokens,
            completion_tokens=cb.completion_tokens,
            total_cost=cb.total_cost,
            result=result
        )