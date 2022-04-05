import { hideElemClass, waitForSaveClass } from "../../common/constants";
import { convertMsToTime, stateMap } from "../../common/helpers";
import { ButtonColor, CommentData } from "../../common/interfaces";
import { Comment } from "./comment";
import { MiniPlayerBtn } from "../util-components";

export function SavedComment(data: CommentData): HTMLDivElement {
  const timestampLabel = document.createElement("label");
  const timestamp = data.timestamp <= 50 ? 50 : data.timestamp;
  timestampLabel.innerText = convertMsToTime(timestamp);
  timestampLabel.classList.add("Link--muted");
  timestampLabel.addEventListener("click", () => {
    stateMap[data.idx].mainPlayer.goto(timestamp, false);
  });

  const copy = MiniPlayerBtn("Copy", ButtonColor.Yellow, [waitForSaveClass, hideElemClass], false);
  copy.addEventListener("click", (event: MouseEvent) => handleCopy(event, data));

  const topContainer = document.createElement("div");
  topContainer.classList.add("d-flex", "flex-justify-center", "flex-items-center", "p-2");
  topContainer.style.width = "100%";
  topContainer.appendChild(timestampLabel);
  topContainer.appendChild(copy);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("d-flex", "flex-justify-center", "mb-2");

  const edit = MiniPlayerBtn("Edit", ButtonColor.Green);
  const del = MiniPlayerBtn("Delete", ButtonColor.Red);
  buttonsContainer.appendChild(edit);
  buttonsContainer.appendChild(del);

  const container = document.createElement("div");
  container.classList.add(
    "d-flex",
    "mx-2",
    "flex-column",
    "flex-items-center",
    "color-shadow-small",
    "border",
    "refg-comment"
  );
  container.style.height = "250px";
  container.style.width = "150px";

  edit.addEventListener("click", (event: MouseEvent) => {
    handleEdit(event, data, container);
  });
  del.addEventListener("click", (event: MouseEvent) => {
    handleDel(event, container);
  });

  container.appendChild(topContainer);
  container.appendChild(data.contents);
  container.appendChild(buttonsContainer);

  data.contents = null;

  return container;
}

function handleDel(event: MouseEvent, container: HTMLDivElement): void {
  container.remove();
}

function handleEdit(event: MouseEvent, data: CommentData, container: HTMLDivElement): void {
  container.replaceWith(Comment(data));
}

function handleCopy(event: MouseEvent, data: CommentData): void {
  const sessionId = stateMap[data.idx].sessionDetails.id;
  void navigator.clipboard.writeText(`SESSION[${sessionId}]_C[${data.comment_id}]: ${data.rawText}\n`);
}
