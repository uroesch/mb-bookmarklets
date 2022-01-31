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
  const version = "0.0.1-alpha";

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
        number = elements[first_cell].textContent;
        name = elements[first_cell + 1].textContent.replace(
          /.*-\s+\d+\.\s+/,
          ""
        );
        duration = elements[first_cell + 2].textContent;
        entry = number.trim() + ". " + name.trim() + " " + duration.trim();
        entries.push(entry);
      }
    }
    return entries.join("\n");
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
      entry = number + " " + name + " " + duration;
      entries.push(entry);
    }
    return entries.join("\n");
  }

  function main() {
    const site_name = window.location.hostname.replace(/.*\.(.*\..*)$/, "$1");
    let track_list = "";
    switch (site_name) {
      case "cede.ch":
        track_list = parse_cede();
        break;
      case "exlibris.ch":
        track_list = parse_exlibris();
        break;
    }
    console.log(track_list);
    to_textarea(track_list);
  }

  main();
})();
