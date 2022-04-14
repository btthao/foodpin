import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { client } from "../client";
import { Feed } from "../components";
import { selectFeed, setFeedData } from "../store/features/feedSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { feedQuery } from "../utils/data";
import ProgressBar from "@badrap/bar-of-progress";
import { useToast } from "@chakra-ui/react";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const { mainFeed } = useAppSelector(selectFeed);
  const progress = new ProgressBar({
    size: 4,
    color: "#6fb96f",
    delay: 0,
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!mainFeed.length) {
      progress.start();
      setLoading(true);

      // only fetch one time then store in redux
      client
        .fetch(feedQuery)
        .then((data) => {
          dispatch(setFeedData({ type: "main", data }));
          progress.finish();
          setTimeout(() => {
            setLoading(false);
          }, 400);
          toast.closeAll();
        })
        .catch((err) => {
          console.error(err);
          progress.finish();
          toast({
            title: "Something went wrong. Try again later.",
            status: "error",
            duration: null,
            isClosable: true,
          });
        });
    }
  }, []);

  return <div>{!loading && mainFeed.length && <Feed data={mainFeed} />}</div>;
};

export default Home;
