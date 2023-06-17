import DatabaseCard from "./DatabaseCard";

// Define the type for the individual database object
interface DatabaseObject {
  name: string;
  type: string | undefined;
  created_at: string;
  uuid: string;
}

type DatabaseObjectArray = DatabaseObject[];
interface Props {
  databases: DatabaseObjectArray;
}

const Table = ({ databases }: Props) => {
  return (
    <div className="flex flex-row flex-wrap justify-center">
      {databases.map((card, index) => (
        <div key={index} className="m-2 flex w-1/2 flex-col">
          <DatabaseCard
            key={index}
            logo={"/images/postgres-icon.png"}
            title={card.name}
            uuid={card.uuid}
            lastUpdated={card.created_at}
          />
        </div>
      ))}
    </div>
  );
};

export default Table;
