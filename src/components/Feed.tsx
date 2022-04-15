import Masonry from "react-masonry-css";
import { RecipeData } from "../utils/data";
import Pin from "./recipe/Pin";

interface FeedProps {
  data: RecipeData[];
}

const breakpointColumnsObj = {
  default: 16,
  4000: 12,
  3500: 10,
  3000: 8,
  2400: 6,
  2000: 5,
  1400: 4,
  1000: 3,
  700: 2,
};

const Feed: React.FC<FeedProps> = ({ data }) => {
  return (
    <div className="px-6 sm:px-14 md:px-20">
      <Masonry className="flex" breakpointCols={breakpointColumnsObj}>
        {data.map((pin) => (
          <Pin key={"pin-" + pin._id} data={pin} />
        ))}
      </Masonry>
    </div>
  );
};

export default Feed;
