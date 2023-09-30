import DatabaseCard from "./DatabaseCard";

// Define the type for the individual database object
interface DatabaseObject {
  title: string;
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
    <div className="grid grid-flow-row-dense gap-4 md:grid-cols-2 lg:grid-cols-3">
      {databases.map((card, index) => (
        <div key={index}>
          <DatabaseCard
            key={index}
            logo={"/images/postgres-icon.png"}
            title={card.title}
            uuid={card.uuid}
            lastUpdated={card.created_at}
          />
        </div>
      ))}
    </div>
  );
};

export default Table;
