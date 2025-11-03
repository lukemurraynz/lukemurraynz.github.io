import React from "react";
import Giscus from "@giscus/react";
import { useColorMode } from "@docusaurus/theme-common";
import useIsBrowser from "@docusaurus/useIsBrowser";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function Comments(): JSX.Element {
  const { colorMode } = useColorMode();
  const isBrowser = useIsBrowser();
  const { i18n } = useDocusaurusContext();
  const lang = i18n?.currentLocale || "en";

  // Avoid SSR/hydration mismatch by rendering only on the client
  if (!isBrowser) return null;

  return (
    <div>
      <Giscus
        id="comments"
        repo="lukemurraynz/lukemurraynz.github.io"
        repoId="MDEwOlJlcG9zaXRvcnkxMjkwNzA2ODc="
        category="Q&A"
        categoryId="DIC_kwDOB7F2X84CxYWS"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={colorMode === "dark" ? "dark_tritanopia" : "light_tritanopia"}
        lang={lang}
        loading="lazy"
      />
    </div>
  );
}