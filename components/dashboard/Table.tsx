import Link from "next/link";
import DatabaseCard from "./DatabaseCard";

// Define the type for the individual database object
interface DatabaseObject {
  name: string;
  type: string | undefined;
  lastUpdated: string;
}

type DatabaseObjectArray = DatabaseObject[];
interface Props {
  databases: DatabaseObjectArray;
}

const Table = ({ databases }: Props) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gridGap: "20px",
      }}
    >
      {databases.map((card, index) => (
        <DatabaseCard
          key={index}
          logo={"/images/postgres-icon.png"}
          title={card.name}
          lastUpdated={card.lastUpdated}
        />
      ))}
    </div>
  );
};

export default Table;