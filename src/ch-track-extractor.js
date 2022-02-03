/**
 *
 * @summary Bookmarklet script for extracting track data from Swiss sites.
 *
 * @description Bookmarklet to extract track data a number of from Swiss sites.
 *   Currently supported are cede.ch and exlibris.ch. Support for fonoteca.ch
 *   is planced but not yet implemented. The code here is still alpha level
 *   quality! Use at your own risk.
 *
 */
javascript: (() => {
  const VERSION = "0.0.3-alpha";
  const FONOTECA_LABEL = {
    "Audio track": "number", // English
    "Musical work title": "name", // English
    Position: "number", // Deutsch
    Musikwerktitel: "name", // Deutsch
    "Traccia audio": "number", // Italiano
    "Titolo dell'opera musicale": "name", // Italiano
    "Plage audio": "number", // Français
    "Titre de l'oeuvre musicale": "name", // Français
    Pusiziun: "number", // Rumantsch
    "Titel da l'ovra musicala": "name", // Rumantsch
  };

  /**
   * Format the array of tracks into a text body.
   */
  function format_list(track_list) {
    let text = "";
    track_list.forEach((entry) => {
      text += entry["number"].trim() + ". ";
      text += entry["name"].trim() + " ";
      text += entry["duration"] ? entry["duration"] : "??:??";
      text += "\n";
    });
    return text;
  }

  /**
   * Create a text area at the top of the page with given string in it.
   * @param {string} text - Multiline string with extracted track information.
   */
  function to_textarea(text) {
    if (text === "") return "#";
    let text_area = document.createElement("textarea");
    text_area.value = text;

    // Avoid scrolling to bottom
    text_area.style.top = "0";
    text_area.style.left = "0";
    text_area.style.position = "fixed";

    document.body.appendChild(text_area);
    text_area.focus();
    text_area.select();
  }

  /**
   * Translate the label from any of the file languages found on fonoteca
   * to a single keyword.
   */
  function fonoteca_label(label) {
    return FONOTECA_LABEL[label] ?? null;
  }

  /** Extract release information from the exlibris.ch site. */
  function parse_exlibris() {
    let entries = [];
    let discs = document
      .getElementsByClassName("o-tracks")[0]
      .getElementsByTagName("table");
    for (disc of discs) {
      for (let track of disc.getElementsByTagName("tr")) {
        elements = track.getElementsByTagName("td");
        first_cell = elements.length - 3;
        number = elements[first_cell].textContent.replace(/\.$/, "");
        name = elements[first_cell + 1].textContent.replace(
          /.*-\s+\d+\.\s+/,
          ""
        );
        duration = elements[first_cell + 2].textContent;
        entries.push({ number, name, duration });
      }
    }
    return entries;
  }

  /** Extract release information from the cede.ch site. */
  function parse_cede() {
    let entries = [];
    let tracks = document
      .getElementById("player")
      .getElementsByClassName("track");
    for (let track of tracks) {
      number = track.getElementsByClassName("tracknumber")[0].textContent;
      duration = track.getElementsByClassName("duration")[0].textContent;
      name = track
        .getElementsByClassName("trackname")[0]
        .firstChild.textContent.replace(/.*-\s+\d+\.\s+/, "");
      entry = { number, name, duration };
      entries.push(entry);
    }
    return entries;
  }

  /** Extract release information from fonoteca.ch */
  function parse_fonoteca() {
    let elements = document.getElementsByClassName("tbl-detail-tdlft");
    let entries = [];
    let item = null;
    for (i of elements) {
      content = i.parentNode.getElementsByTagName("td");
      label = fonoteca_label(content[0].innerText);
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
    const site_name = window.location.hostname.replace(/.*\.(.*\..*)$/, "$1");
    let track_list = [];
    switch (site_name) {
      case "cede.ch":
        track_list = parse_cede();
        break;
      case "exlibris.ch":
        track_list = parse_exlibris();
        break;
      case "fonoteca.ch":
        track_list = parse_fonoteca();
        break;
    }
    let text_list = format_list(track_list);
    console.log(text_list);
    to_textarea(text_list);
  }

  main();
})();
