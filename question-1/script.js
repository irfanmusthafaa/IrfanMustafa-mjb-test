var playersData = [];
// Fungsi untuk memulai permainan
function startGame() {
    playersData = [];
    var playerCountInput = document.getElementById('playerCount');
    var diceCountInput = document.getElementById('diceCount');
    var playerCount = parseInt(playerCountInput.value);
    var diceCount = parseInt(diceCountInput.value);
    for (var i = 0; i < playerCount; i++) {
        var player = {
            diceResults: [],
            evaluationResults: [],
            points: 0,
            pointsHistory: [],
            diceCount: diceCount,
            diceToShare: 0
        };
        playersData.push(player);
    }
    console.log("Pemain = ".concat(playerCount, ", Dadu = ").concat(diceCount));
    console.log('==================');
    playGame();
}
// Fungsi untuk melempar dadu
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}
// Fungsi utama permainan
function playGame() {
    playersData.forEach(function (player, index) {
        var diceRollResults = [];
        for (var i = 0; i < player.diceCount; i++) {
            diceRollResults.push(rollDice());
        }
        var evaluationResults = evaluateDice(diceRollResults);
        player.diceResults.push(diceRollResults);
        player.evaluationResults.push(evaluationResults[0]);
        player.points += evaluationResults[1];
        player.pointsHistory.push(player.points);
        player.diceToShare = evaluationResults[2];
        updateDiceCount(index);
    });
    shareDice();
    randomize();
}
// Fungsi untuk mengevaluasi hasil dadu
function evaluateDice(diceRolls) {
    var remainingDice = [];
    var points = 0;
    var diceToShare = 0;
    diceRolls.forEach(function (dice) {
        if (dice === 1) {
            diceToShare++;
        }
        else if (dice === 6) {
            points++;
        }
        else {
            remainingDice.push(dice);
        }
    });
    return [remainingDice, points, diceToShare];
}
// Fungsi untuk memperbarui jumlah dadu
function updateDiceCount(index) {
    var player = playersData[index];
    var lastRollCount = player.evaluationResults[player.evaluationResults.length - 1].length;
    player.diceCount = lastRollCount;
}
// Fungsi untuk membagikan dadu
function shareDice() {
    playersData.forEach(function (player, index) {
        if (player.diceToShare > 0) {
            var nextPlayerIndex = (index + 1) % playersData.length;
            var nextPlayer = playersData[nextPlayerIndex];
            nextPlayer.diceCount += player.diceToShare;
            for (var i = 0; i < player.diceToShare; i++) {
                nextPlayer.evaluationResults[nextPlayer.evaluationResults.length - 1].push(1);
            }
            player.diceToShare = 0;
        }
    });
}
// Fungsi untuk melanjutkan permainan atau menampilkan hasil
function randomize() {
    var activePlayersCount = playersData.filter(function (player) { return player.diceCount > 0; }).length;
    if (activePlayersCount > 1) {
        playGame();
    }
    else {
        var remainingPlayers = playersData.filter(function (player) { return player.diceCount > 0; });
        if (remainingPlayers.length === 1) {
            console.log("Game berakhir karena hanya pemain #".concat(playersData.indexOf(remainingPlayers[0]) + 1, " yang memiliki dadu."));
        }
        else {
            console.log('Permainan berakhir karena hanya satu pemain yang memiliki sisa dadu.');
        }
        displayResults();
    }
}
// Fungsi untuk menampilkan hasil permainan
function displayResults() {
    var totalRounds = playersData[0].diceResults.length;
    var _loop_1 = function (round) {
        // Display results in the console
        console.log("Giliran ".concat(round + 1, " lempar dadu:"));
        playersData.forEach(function (player, index) {
            if (player.diceCount > 0) {
                console.log("Pemain #".concat(index + 1, " (").concat(player.pointsHistory[round], "): ").concat(player.diceResults[round].join(', ')));
            }
            else {
                console.log("Pemain #".concat(index + 1, " _ (Berhenti bermain karena tidak memiliki dadu)"));
            }
        });
        console.log('Setelah Evaluasi:');
        playersData.forEach(function (player, index) {
            if (player.diceCount > 0) {
                console.log("Pemain #".concat(index + 1, " (").concat(player.pointsHistory[round], "): ").concat(player.evaluationResults[round].join(', ')));
            }
            else {
                console.log("Pemain #".concat(index + 1, " _ (Berhenti bermain karena tidak memiliki dadu)"));
            }
        });
        console.log('==================');
        // Display results in HTML
        var generateRollResultsHtml = function (round) {
            var html = '<ul>';
            playersData.forEach(function (player, index) {
                html += "\n                    <li>Pemain #".concat(index + 1, " (").concat(round === 0 ? '0' : player.pointsHistory[round - 1], "): ").concat(player.diceResults[round].join(', '), "</li>\n                ");
            });
            html += '</ul>';
            return html;
        };
        var generateEvaluationResultsHtml = function (round) {
            var html = '<ul>';
            playersData.forEach(function (player, index) {
                html += "\n                    <li>Pemain #".concat(index + 1, " (").concat(player.pointsHistory[round], "): ").concat(player.evaluationResults[round].join(', '), "</li>\n                ");
            });
            html += '</ul>';
            return html;
        };
        var resultsHtml = "\n            <div class=\"round\">\n                <div class=\"garis\"></div>\n                <b>Giliran ".concat(round + 1, " lempar dadu:</b>\n                ").concat(generateRollResultsHtml(round), "\n                <b>Setelah Evaluasi:</b>\n                ").concat(generateEvaluationResultsHtml(round), "\n            </div>\n        ");
        var gameResultDiv = document.getElementById('game-result');
        if (gameResultDiv) {
            gameResultDiv.innerHTML += resultsHtml;
        }
    };
    for (var round = 0; round < totalRounds; round++) {
        _loop_1(round);
    }
    // Find Winner
    var winnerIndex = 0;
    var highestPoints = 0;
    playersData.forEach(function (player, index) {
        if (player.points > highestPoints) {
            winnerIndex = index;
            highestPoints = player.points;
        }
    });
    var winnerResultP = document.getElementById('winner-result');
    if (winnerResultP) {
        winnerResultP.innerHTML = "Game di menangkan oleh pemain #".concat(winnerIndex + 1, " dengan skor <b>").concat(highestPoints, "</b> memiliki poin lebih banyak dari pemain lainnya");
    }
    // Display the result in the console
    console.log("Game di menangkan oleh pemain #".concat(winnerIndex + 1, " dengan skor ").concat(highestPoints, " memiliki poin lebih banyak dari pemain lainnya"));
}
