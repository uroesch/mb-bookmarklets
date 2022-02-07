/**
 *
 * @summary Bookmarklet script for extracting track data from Swiss sites.
 *
 * @description Bookmarklet to extract track data a number of from Swiss sites.
 *   Currently supported are cede.ch ,exlibris.ch and fonoteca.ch.
 *   The code here is still alpha level quality! Use at your own risk.
 *
 */
javascript: (() => {
  const VERSION = "0.0.8-alpha";
  const FONOTECA_LABEL = {
    "Audio track": "number", // English
    "Musical work title": "name", // English
    "Work title": "name", //English
    Position: "number", // Deutsch
    Musikwerktitel: "name", // Deutsch
    Werktitel: "name", // Deutsch
    "Traccia audio": "number", // Italiano
    "Titolo dell'opera musicale": "name", // Italiano
    "Titolo dell'opera": "name", // Italiano
    "Plage audio": "number", // Français
    "Titre de l'oeuvre musicale": "name", // Français
    "Titre de l'oeuvre": "name", // Français
    Pusiziun: "number", // Rumantsch
    "Titel da l'ovra musicala": "name", // Rumantsch
    "Titel da l'ovra": "name", // Rumantsch
  };

  /**
   * Format the array of tracks into a text body.
   */
  function formatList(trackList) {
    let text = "";
    trackList.forEach((entry) => {
      console.log(entry);
      text += entry["number"].trim().replace(/\.$/, "") + ". ";
      text += entry["name"].trim() + " ";
      text += "(";
      text += entry["duration"] ? entry["duration"] : "??:??";
      text += ")\n";
    });
    return text;
  }

  /**
   * Create a text area at the top of the page with given string in it.
   * @param {string} text - Multiline string with extracted track information.
   */
  function toTextArea(text) {
    if (text === "") return "#";
    let textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  }

  /**
   * Translate the label from any of the file languages found on fonoteca
   * to a single keyword.
   */
  function fonotecaLabel(label) {
    return FONOTECA_LABEL[label] ?? null;
  }

  /**
   * Get rid of the preamble in a track.
   */
  String.prototype.cleanTrack = function () {
    return this.replace(/.*-\s+\d+[\.,]\s+/, "");
  };

  /**
   * Extract release information from the exlibris.ch site.
   */
  function parseExlibris() {
    const entries = [];
    const discs = document
      .getElementsByClassName("o-tracks")[0]
      .getElementsByTagName("table");
    for (let disc of discs) {
      for (let track of disc.getElementsByTagName("tr")) {
        elements = track.getElementsByTagName("td");
        firstCell = elements.length - 3;
        number = elements[firstCell].textContent;
        name = elements[firstCell + 1].textContent.cleanTrack();
        duration = elements[firstCell + 2].textContent;
        entries.push({ number, name, duration });
      }
    }
    return entries;
  }

  /**
   * Extract release information from the cede.ch site.
   */
  function parseCede() {
    const entries = [];
    const tracks = document
      .getElementById("player")
      .getElementsByClassName("track");
    for (let track of tracks) {
      number = track.getElementsByClassName("tracknumber")[0].textContent;
      duration = track.getElementsByClassName("duration")[0].textContent;
      name = track
        .getElementsByClassName("trackname")[0]
        .firstChild.textContent.cleanTrack();
      entries.push({ number, name, duration });
    }
    return entries;
  }

  /**
   * Extract release information from fonoteca.ch
   */
  function parseFonoteca() {
    let item = null;
    const entries = [];
    const tracks = document.getElementsByClassName("tbl-detail-tdlft");
    for (let row of tracks) {
      content = row.parentNode.getElementsByTagName("td");
      label = fonotecaLabel(content[0].innerText);
      text = content[1].innerText;
      if (!label) continue;
      switch (label) {
        case "number": {
          item = item == null ? 0 : item + 1;
          entries[item] = { number: text };
          break;
        }
        case "name": {
          entries[item]["name"] = text;
          break;
        }
      }
    }
    return entries;
  }

  function main() {
    const siteName = window.location.hostname.replace(/.*\.(.*\..*)$/, "$1");
    let trackList = [];
    switch (siteName) {
      case "cede.ch":
        trackList = parseCede();
        break;
      case "exlibris.ch":
        trackList = parseExlibris();
        break;
      case "fonoteca.ch":
        trackList = parseFonoteca();
        break;
    }
    const textList = formatList(trackList);
    console.log(textList);
    toTextArea(textList);
  }
  main();
})();
