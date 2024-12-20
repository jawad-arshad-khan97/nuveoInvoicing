import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, isDarkMode }) => {
  return {
    headerTitleRefine: {
      margin: "0 !important",
      fontFamily: "Bricolage Grotesque, sans-serif",
      color: `${isDarkMode ? token["blue-10"] : token["blue-8"]} !important`,
      fontWeight: "400 !important",
    },
    headerTitleInvoicer: {
      margin: "0 !important",
      fontFamily: "Bricolage Grotesque, sans-serif",
      color: `${isDarkMode ? token["blue-10"] : token["blue-8"]} !important`,
      fontWeight: 700,
    },
  };
});
