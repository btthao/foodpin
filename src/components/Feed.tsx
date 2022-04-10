import { useEffect } from "react";
import Masonry from "react-masonry-css";
import { client } from "../client";
import { selectFeed, setFeedData } from "../store/features/feedSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { feedQuery } from "../utils/data";
import Pin from "./Pin";

interface FeedProps {}

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

const Feed: React.FC<FeedProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { mainFeed } = useAppSelector(selectFeed);

  useEffect(() => {
    client.fetch(feedQuery).then((data) => {
      console.log(data);
      dispatch(setFeedData({ type: "main", data }));
    });
  }, []);

  return (
    <div className="py-3 px-8 sm:px-20">
      <Masonry className="flex" breakpointCols={breakpointColumnsObj}>
        {mainFeed.map((pin) => (
          <Pin key={"pin-" + pin._id} data={pin} />
        ))}
      </Masonry>
    </div>
  );
};

export default Feed;
