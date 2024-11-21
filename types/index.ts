export type GetImagesResponse = Awaited<ReturnType<typeof import("@/server/api/panel/get-images.post.js").default>>;
export type GetPromptsResponse = Awaited<ReturnType<typeof import("@/server/api/panel/prompts.get.js").default>>;
export type GetLanguagesResponse = Awaited<ReturnType<typeof import("@/server/api/panel/languages.get.js").default>>;

export interface GptDescriptionItem {
  name: string;
  content: string;
  type: "input" | "editor";
}

export interface GptDescription {
  [key: string]: GptDescriptionItem;
}

export interface PromptGroups {
  [prompt_id: string]: number[];
}
