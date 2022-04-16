import { Feed } from "../components";
import { selectFeed } from "../store/features/feedSlice";
import { useAppSelector } from "../store/store";

const Search: React.FC = () => {
  const { searchFeed } = useAppSelector(selectFeed);
  return (
    <div>
      <Feed data={searchFeed} />
    </div>
  );
};

export default Search;
