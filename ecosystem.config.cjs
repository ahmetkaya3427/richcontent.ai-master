module.exports = {
  apps: [
    {
      name: "richcontent-v2",
      port: "4114",
      instances: "max",
      script: "./.output/server/index.mjs",
      time: true,
    },
  ],
};
