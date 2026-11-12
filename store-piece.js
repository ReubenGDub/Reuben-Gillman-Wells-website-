// =========================================================
// FIND: STORE PIECE — Edition/layout dropdowns, image, price and links.
// Reads the PIECE data defined in each store page.
// =========================================================
(function () {
    if (typeof PIECE === "undefined") return;
  
    const $ = (id) => document.getElementById(id);
    const editionSelect = $("editionSelect");
    const layoutSelect = $("layoutSelect");
    const preview = $("scorePreview");
    const priceEl = $("studyPrice");
    const buyBtn = $("buyBtn");
    const performBtn = $("performBtn");
    const performFrom = $("performFrom");
    const moreInfoBtn = $("moreInfoBtn");
  
    const keys = Object.keys(PIECE.editions);
    let edition = PIECE.defaultEdition || keys[0];
    let layout = "full-score";
  
    const money = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2)) + " AUD";
  
    // ---- Static bits ----
    if (moreInfoBtn && PIECE.infoPage) moreInfoBtn.href = PIECE.infoPage;
    if (performFrom) {
      if (typeof PIECE.performanceFrom === "number") {
        performFrom.textContent = "From: " + money(PIECE.performanceFrom);
      } else {
        performFrom.hidden = true;
      }
    }
  
    // ---- Edition dropdown: placeholder + every edition ----
    if (editionSelect) {
      if (keys.length < 2) {
        editionSelect.hidden = true;
      } else {
        const placeholder = new Option("More Editions", "", true, true);
        placeholder.disabled = true;
        editionSelect.add(placeholder);
        keys.forEach((key) => {
          const isOriginal = key === (PIECE.defaultEdition || keys[0]);
          const label = PIECE.editions[key].name + (isOriginal ? " (original)" : "");
          editionSelect.add(new Option(label, key));
        });
        editionSelect.addEventListener("change", () => {
          edition = editionSelect.value;
          layout = "full-score";
          render();
        });
      }
    }
  
    if (layoutSelect) {
      layoutSelect.addEventListener("change", () => {
        layout = layoutSelect.value;
        renderPrice();
      });
    }
  
    // Blank Buy Now link: do nothing
    if (buyBtn) {
      buyBtn.addEventListener("click", (e) => {
        if (buyBtn.getAttribute("aria-disabled") === "true") e.preventDefault();
      });
    }
  
    function renderPrice() {
      const ed = PIECE.editions[edition];
      const lay = ed.layouts[layout];
      if (!lay) return;
  
      priceEl.textContent = money(lay.price);
  
      if (lay.link) {
        buyBtn.href = lay.link;
        buyBtn.target = "_blank";
        buyBtn.rel = "noopener noreferrer";
        buyBtn.removeAttribute("aria-disabled");
      } else {
        buyBtn.href = "#";
        buyBtn.setAttribute("aria-disabled", "true");
      }
    }
  
    function render() {
      const ed = PIECE.editions[edition];
  
      // Image changes with edition only
      if (preview) {
        if (ed.image) {
          preview.src = ed.image;
          preview.alt = PIECE.title + " score preview (" + ed.name + ")";
          preview.hidden = false;
        } else {
          preview.hidden = true;
        }
      }
  
      // Layout options belong to the edition
      const layoutKeys = Object.keys(ed.layouts);
      if (!ed.layouts[layout]) layout = layoutKeys[0];
      layoutSelect.innerHTML = "";
      layoutKeys.forEach((key) => {
        layoutSelect.add(new Option(ed.layouts[key].label, key, false, key === layout));
      });
  
      renderPrice();
  
      // Licensing form link: passes the piece, the chosen edition and the edition list
      if (performBtn) {
        const params = new URLSearchParams({
          piece: PIECE.title,
          edition: ed.name,
          editions: keys.map((k) => PIECE.editions[k].name).join("|")
        });
        performBtn.href = "../licensing.html?" + params.toString();
      }
    }
  
    render();
  })();
