import DatabaseCard from "./DatabaseCard";

// Define the type for the individual database object
interface DatabaseObject {
  title: string;
  type: string | undefined;
  created_at: string;
  uuid: string;
}

export type DatabaseObjectArray = DatabaseObject[];
interface Props {
  databases: DatabaseObjectArray;
  refetch: () => void;
}

const getDatabaseLogo = (type: string | undefined) => {
  if (type === "postgres") {
    return "/images/postgres-icon.png";
  }

}

const Table = ({ databases, refetch }: Props) => {
  return (
    <div className="grid grid-flow-row-dense gap-4 md:grid-cols-2 lg:grid-cols-3">
      {databases.map((card, index) => (
        <div key={index}>
          <DatabaseCard
            key={index}
            logo={getDatabaseLogo("postgres")}
            title={card.title}
            uuid={card.uuid}
            lastUpdated={card.created_at}
            refetch={refetch}
          />
        </div>
      ))}
    </div>
  );
};

export default Table;
