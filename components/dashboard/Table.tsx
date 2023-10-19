import DatabaseCard from "./DatabaseCard";

// Define the type for the individual database object
interface DatabaseObject {
  title: string;
  created_at: string;
  uuid: string;
  dbType: string | null;
}

export type DatabaseObjectArray = DatabaseObject[];
interface Props {
  databases: DatabaseObjectArray;
  refetch: () => void;
}

const getDatabaseLogo = (type: string | undefined) => {
  switch (type) {
    case "postgres":
      return "/images/postgres-icon.png";
    case "mysql":
      return "/images/mysql-icon.svg";
    default:
      return "/images/postgres-icon.png";
  }
};

const Table = ({ databases, refetch }: Props) => {
  return (
    <div className="grid grid-flow-row-dense gap-4 md:grid-cols-2 lg:grid-cols-3">
      {databases.map((db, index) => (
        <div key={index}>
          <DatabaseCard
            type={db.dbType}
            key={index}
            logo={getDatabaseLogo(db.dbType.toLowerCase())}
            title={db.title}
            uuid={db.uuid}
            lastUpdated={db.created_at}
            refetch={refetch}
          />
        </div>
      ))}
    </div>
  );
};

export default Table;
