document
        .getElementById("imageInput")
        .addEventListener("change", handleImage);
      document.getElementById("rows").addEventListener("input", applyChanges);
      document.getElementById("cols").addEventListener("input", applyChanges);
      document
        .getElementById("gridColor")
        .addEventListener("input", applyChanges);
      document
        .getElementById("gridThickness")
        .addEventListener("input", applyChanges);
      document
        .getElementById("brightness")
        .addEventListener("input", applyChanges);
      document
        .getElementById("contrast")
        .addEventListener("input", applyChanges);
      document
        .getElementById("saturation")
        .addEventListener("input", applyChanges);
      document
        .getElementById("opacity")
        .addEventListener("input", applyChanges);

      let image = new Image();
      let initialImageSrc = "";

      function handleImage() {
        const input = document.getElementById("imageInput");
        const canvas = document.getElementById("imageCanvas");
        const ctx = canvas.getContext("2d");

        image.onload = function () {
          canvas.width = image.width;
          canvas.height = image.height;

          // Draw the image on the canvas
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          // Apply user-specified filters initially
          applyChanges();

          // Save the initial image source for reset
          initialImageSrc = image.src;
        };

        const file = input.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            image.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }

      function applyChanges() {
        const canvas = document.getElementById("imageCanvas");
        const ctx = canvas.getContext("2d");

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply user-specified filters
        ctx.filter = `brightness(${
          document.getElementById("brightness").value
        }%) contrast(${document.getElementById("contrast").value}%) saturate(${
          document.getElementById("saturation").value
        }%) opacity(${document.getElementById("opacity").value}%)`;

        // Draw the original image with filters applied
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Get user inputs
        const rows = parseInt(document.getElementById("rows").value, 10);
        const cols = parseInt(document.getElementById("cols").value, 10);
        const gridColor = document.getElementById("gridColor").value;
        const gridThickness = parseInt(
          document.getElementById("gridThickness").value,
          10
        );

        // Draw grids with user-specified color and thickness
        drawGrids(
          ctx,
          canvas.width,
          canvas.height,
          rows,
          cols,
          gridColor,
          gridThickness
        );

        // Reset filter to default
        ctx.filter = "none";
      }

      function resetChanges() {
        // Reset all input values
        document.getElementById("rows").value = 10;
        document.getElementById("cols").value = 10;
        document.getElementById("gridColor").value = "#000000";
        document.getElementById("gridThickness").value = 1;
        document.getElementById("brightness").value = 100;
        document.getElementById("contrast").value = 100;
        document.getElementById("saturation").value = 100;
        document.getElementById("opacity").value = 100;

        // Reset the image source to the initial state
        image.src = initialImageSrc;

        // Apply initial changes
        applyChanges();
      }

      function drawGrids(
        ctx,
        width,
        height,
        rows,
        cols,
        gridColor,
        gridThickness
      ) {
        ctx.strokeStyle = gridColor; // User-specified grid color
        ctx.lineWidth = gridThickness;

        // Draw horizontal grid lines
        for (let i = 1; i < rows; i++) {
          const y = (i / rows) * height;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Draw vertical grid lines
        for (let i = 1; i < cols; i++) {
          const x = (i / cols) * width;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
      }

      function downloadImage() {
        const canvas = document.getElementById("imageCanvas");
        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "edited_image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }