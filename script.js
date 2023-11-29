
var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function showMyLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      
      map.setView([latitude, longitude], 13);
      
      const marker = L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`Twoja lokalizacja: ${latitude}, ${longitude}`)
        .openPopup();
    });
  } else {
    alert("Twoja przeglądarka nie obsługuje Geolocation API.");
  }
}

function generatePuzzlePieces(map) {
  var puzzleContainer = document.getElementById("puzzleContainer");
  puzzleContainer.innerHTML = "";

  var puzzlePieces = [];
  var board = document.getElementById("board");
  board.innerHTML = "";

  leafletImage(map, function (err, canvas) {
    if (err) {
      console.error(err);
      return;
    }

    var pieceWidth = canvas.width / 4;
    var pieceHeight = canvas.height / 4;

    for (var row = 0; row < 4; row++) {
      for (var col = 0; col < 4; col++) {
        var puzzlePiece = document.createElement("div");
        puzzlePiece.className = "puzzle-piece";
        puzzlePiece.setAttribute("draggable", "true");
        puzzlePiece.ondragstart = function (event) {
          drag(event);
        };
        puzzlePiece.style.width = pieceWidth + "px";
        puzzlePiece.style.height = pieceHeight + "px";
        puzzlePiece.id = "puzzlePiece" + (row * 4 + col + 1);

        var pieceCanvas = document.createElement("canvas");
        pieceCanvas.width = pieceWidth;
        pieceCanvas.height = pieceHeight;
        var ctx = pieceCanvas.getContext("2d");
        ctx.drawImage(
          canvas,
          -col * pieceWidth,
          -row * pieceHeight,
          canvas.width,
          canvas.height
        );
        puzzlePiece.appendChild(pieceCanvas);
        puzzlePieces.push(puzzlePiece);
      }
    }

    puzzlePieces.sort(function () {
      return 0.5 - Math.random();
    });

    puzzlePieces.forEach(function(piece) {
      piece.addEventListener("dragend", dragEnd);
      puzzleContainer.appendChild(piece);
    });

    for (let i = 1; i <= 16; i++) {
      const block = document.createElement("div");
      block.classList.add("block");
      block.setAttribute("draggable", "true");
      block.ondragstart = function (event) {
        dragStartBlock(event);
      };
      block.addEventListener("dragover", dragOver);
      block.addEventListener("drop", drop);
      block.addEventListener("dragleave", allowDrop);

      block.id = "block" + i;
      board.appendChild(block);
    }
  });
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function dragOver(event) {
  event.preventDefault();
}

function dragStart(event) {
  var dragImage = event.target.cloneNode(true);
  dragImage.id = "dragImage";
  dragImage.style.position = "absolute";
  dragImage.style.zIndex = "1000";
  document.body.appendChild(dragImage);
  event.dataTransfer.setDragImage(dragImage, 0, 0);
  event.dataTransfer.setData("text", event.target.id);
}

function dragStartBlock(event) {
  var dragImage = event.target.cloneNode(true);
  dragImage.id = "dragImage";
  dragImage.style.position = "absolute";
  dragImage.style.zIndex = "1000";
  document.body.appendChild(dragImage);
  event.dataTransfer.setDragImage(dragImage, 0, 0);
  event.dataTransfer.setData("text", event.target.id);
}

function dragEnd(event) {
  var dragImage = document.getElementById("dragImage");
  if (dragImage) {
    dragImage.parentNode.removeChild(dragImage);
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  var piece = document.getElementById(data);

  if (event.target.classList.contains("block")) {
    var block = event.target;

    var hasChild = block.hasChildNodes();

    if (piece.firstChild instanceof HTMLCanvasElement) {
      if (hasChild && piece.parentNode !== block) {
        var tempBackground = block.style.backgroundImage;
        block.style.backgroundImage = piece.style.backgroundImage;
        piece.style.backgroundImage = tempBackground;
      }

      block.style.backgroundImage = `url(${piece.firstChild.toDataURL()})`;

      if (hasChild) {
        var secondChild = document.createElement("div");
        secondChild.style.width = "100%";
        secondChild.style.height = "100%";
        secondChild.style.position = "absolute";
        secondChild.style.backgroundImage = `url(${piece.firstChild.toDataURL()})`;
        block.appendChild(secondChild);
      }

      if (!hasChild) {
        block.appendChild(piece);
        piece.style.display = "none";

        var puzzleContainer = document.getElementById("puzzleContainer");

        if (piece.parentNode === puzzleContainer) {
          puzzleContainer.removeChild(piece);
        }
      }

      checkPuzzleCompletion();
    } else {
      console.error("Invalid puzzle piece dropped");
    }
  }
}

function checkPuzzleCompletion() {
  var boardSquares = document.querySelectorAll(".block");
  var puzzlePiecesInBoard = document.querySelectorAll(".block div");

  if (boardSquares.length === puzzlePiecesInBoard.length) {
    var isSolved = true;
    for (var i = 0; i < boardSquares.length; i++) {
      if (boardSquares[i].firstChild !== puzzlePiecesInBoard[i]) {
        isSolved = false;
        break;
      }
    }
    if (isSolved) {
      alert("Ułożono poprawnie!");
    }
  }
}

var puzzlePieces = document.querySelectorAll('.puzzle-piece');
puzzlePieces.forEach(function(piece) {
  piece.addEventListener('dragstart', dragStart);
});

var blocks = document.querySelectorAll(".block");
blocks.forEach(function(block) {
  block.addEventListener("dragstart", dragStartBlock);
  block.addEventListener("dragover", dragOver);
  block.addEventListener("drop", drop);
  block.addEventListener("dragleave", allowDrop);
});
