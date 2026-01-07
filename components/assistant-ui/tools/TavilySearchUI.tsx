import { makeAssistantToolUI } from "@assistant-ui/react";
import ReactMarkdown from "react-markdown";
import { defaultComponents } from "@/components/assistant-ui/markdown";

export const TavilySearchResultUI = makeAssistantToolUI<
  {
    query: string;
  },
  string
>({
  toolName: "tavily_search_e0f7df6e", // Must match the registered tool's name
  render: ({ argsText, result }) => {
    return (
      <div className="tavily_search-result rounded-lg border p-3">
        <pre className="aui-tool-fallback-args-value whitespace-pre-wrap">
          在这里展示 Tavily 搜索结果
          <br />
          查询内容:
          <br />
          {argsText}
          <br />
          搜索结果:
          <br />
          <ReactMarkdown components={defaultComponents}>{result}</ReactMarkdown>
        </pre>
      </div>
    );
  },
});
