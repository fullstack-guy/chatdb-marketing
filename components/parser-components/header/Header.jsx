// import BackIcon from '@/icons/BackIcon'
import BackIcon from "../../../assets/icons/BackIcon";

const Header = () => {
  return (
    <div className="mb-2 flex items-center border-b-2 pb-2">
      <div className="mr-3 rounded-md border p-2">
        <BackIcon />
      </div>
      <div className="font-bold">Build your audience</div>
    </div>
  );
};

export default Header;
