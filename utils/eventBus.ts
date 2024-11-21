import mitt from "mitt";

type Events = {
  fetchImagesCompleted: void;
  createAllDescriptions: void;
};

const eventBus = mitt<Events>();
export default eventBus;
