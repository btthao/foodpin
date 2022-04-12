import type { NextPage } from "next";
import { useEffect } from "react";
import { client } from "../client";
import { Feed } from "../components";
import { selectFeed, setFeedData } from "../store/features/feedSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { feedQuery } from "../utils/data";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const { mainFeed } = useAppSelector(selectFeed);

  useEffect(() => {
    client.fetch(feedQuery).then((data) => {
      // console.log(data);
      dispatch(setFeedData({ type: "main", data }));
    });
  }, []);

  return (
    <div>
      <Feed data={mainFeed} />
    </div>
  );
};

export default Home;
