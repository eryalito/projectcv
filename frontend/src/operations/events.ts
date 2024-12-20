import { NavigateFunction } from "react-router-dom";
import { ChooseFolder } from "../../wailsjs/go/main/App";
import { EventsOff, EventsOnce } from "../../wailsjs/runtime/runtime";

export async function handleOpenFolder(navigate: NavigateFunction) {
    const result = await ChooseFolder();
    if (result !== "") {
      navigate({
          pathname: "/folder",
          search: `?path=${result}`,
      })
    }
  };

export async function registerEvents(navigate: NavigateFunction) {
    EventsOff("openFolderSelected");
    EventsOnce("openFolderSelected", async () => {
        await handleOpenFolder(navigate);
    });
}