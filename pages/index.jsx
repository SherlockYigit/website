import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import swr from "swr";

import SocialAccountButton from "../components/socialAccountButton";
import DcUserActivity from "../components/dcUserActivity";
import RepoCard from "../components/Cards/repoCard";
import AgeCalculator from "../lib/ageCalculator";
import Layout from "../layouts/mainLayout";
import useLanyard from "../lib/lanyard";
import Config from "../config";

export default () => {
  const { data, error } = swr(
    "https://api.github.com/users/SherlockYigit/repos",
    (url) => fetch(url).then((res) => res.json())
  );

  const [imgStat, setStat] = useState(false);
  const discordUser = useLanyard();

  const statusColor = (user_status) => {
    switch (user_status) {
      case "online":
        return {
          main: "bg-green-400",
          ping: "bg-green-300",
        };
      case "idle":
        return {
          main: "bg-yellow-400",
          ping: "bg-yellow-300",
        };
      case "dnd":
        return {
          main: "bg-red-600",
          ping: "bg-red-500",
        };
      default:
        return {
          main: "bg-gray-600",
          ping: "bg-gray-500",
        };
    }
  };

  return (
    <Layout>
      <div className="flex mt-8 items-center lg:justify-around <lg:flex-col-reverse">
        <div className="max-w-2xl space-y-1 lg:(mt-4 text-left) text-center items-center">
          <h1 className="font-semibold text-2xl sm:text-3xl md:text-4xl text-alignment">
            Self{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">
              {Config.personal.position}
            </span>
          </h1>
          <p className="text-md sm:text-lg md:text-xl text-alignment">
            {Config.personal.description.replace(
              "{age}",
              AgeCalculator(Config.personal.birthday)
            )}
          </p>
          {discordUser.listening_to_spotify ? (
            <DcUserActivity
              service="spotify"
              content={`${discordUser.spotify.artist} - ${discordUser.spotify.song}`}
              url={`https://open.spotify.com/track/${discordUser.spotify.track_id}`}
            />
          ) : discordUser?.activities?.some(
              (activity) => activity.name === "Youtube"
            ) ? (
            <DcUserActivity
              service="youtube"
              content={`${
                discordUser.activities.find(
                  (activity) => activity.name === "Youtube"
                ).details
              }`}
            />
          ) : (
            <DcUserActivity
              service="idle"
              content="He's not doing anything or he's offline."
            />
          )}
        </div>
        <div className="flex justify-center space-x-2">
          <div className="flex inline-flex flex-col space-y-2">
            {Config.personal.socialAccounts.map((account, index) => {
              return <SocialAccountButton {...{ ...account }} key={index} />;
            })}
          </div>
          <div className="relative h-53 w-53 space-y-2">
            <div>
              <div
                id="status"
                className={`p-3 ${
                  statusColor(discordUser?.discord_status)?.ping
                } animate-ping absolute bottom-0 right-0 rounded-md`}
              />
              <div
                id="status"
                className={`p-3 ${
                  statusColor(discordUser?.discord_status)?.main
                } absolute bottom-0 right-0 rounded-md`}
              />
              <div
                id="profileImg_div"
                className={`relative h-52 w-52 rounded-lg bg-gray-600 ${
                  imgStat ? "" : "animate-pulse"
                }`}
              >
                <Image
                  src="/avatar.webp"
                  id="profileImg"
                  alt="Profile IMG"
                  onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                    if (naturalWidth > 1 && naturalHeight > 1) {
                      setStat(true);
                    } else {
                      setStat(false);
                    }
                  }}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg h-52 w-52"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <h1 id="repos" className="text-center text-xl font-semibold">
        Github repositories
      </h1>
      {!error && !data ? (
        <motion.div
          className="flex justify-center"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 20,
          }}
        >
          <ClimbingBoxLoader color="#50E3C2" loading={true} size={30} />
        </motion.div>
      ) : (
        error && (
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 20,
            }}
          >
            There was a problem while fetching Github repositories!
          </motion.p>
        )
      )}
      {!error && data && (
        <motion.div
          className="grid gap-4 md:grid-cols-3"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: {
              opacity: 1,
              scale: 0,
            },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {data
            .filter(
              (repo) => !repo.fork && !["SherlockYigit"].includes(repo.name)
            )
            .map((repo, i) => (
              <RepoCard key={i} {...repo} />
            ))}
        </motion.div>
      )}
    </Layout>
  );
};
