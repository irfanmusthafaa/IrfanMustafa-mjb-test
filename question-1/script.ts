// Data player
interface Player {
    diceResults: number[][];
    evaluationResults: number[][];
    points: number;
    pointsHistory: number[];
    diceCount: number;
    diceToShare: number;
}

let playersData: Player[] = [];

// Fungsi untuk memulai permainan
function startGame(): void {
    playersData = [];
    const playerCountInput = document.getElementById('playerCount') as HTMLInputElement;
    const diceCountInput = document.getElementById('diceCount') as HTMLInputElement;
    const playerCount = parseInt(playerCountInput.value);
    const diceCount = parseInt(diceCountInput.value);

    for (let i = 0; i < playerCount; i++) {
        const player: Player = {
            diceResults: [],
            evaluationResults: [],
            points: 0,
            pointsHistory: [],
            diceCount: diceCount,
            diceToShare: 0
        };
        playersData.push(player);
    }

    console.log(`Pemain = ${playerCount}, Dadu = ${diceCount}`);
    console.log('==================');
    playGame();
}

// Fungsi untuk melempar dadu
function rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
}

// Fungsi utama permainan
function playGame(): void {
    playersData.forEach((player, index) => {
        const diceRollResults: number[] = [];
        for (let i = 0; i < player.diceCount; i++) {
            diceRollResults.push(rollDice());
        }
        const evaluationResults = evaluateDice(diceRollResults);
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
function evaluateDice(diceRolls: number[]): [number[], number, number] {
    const remainingDice: number[] = [];
    let points = 0;
    let diceToShare = 0;

    diceRolls.forEach(dice => {
        if (dice === 1) {
            diceToShare++;
        } else if (dice === 6) {
            points++;
        } else {
            remainingDice.push(dice);
        }
    });

    return [remainingDice, points, diceToShare];
}

// Fungsi untuk memperbarui jumlah dadu
function updateDiceCount(index: number): void {
    const player = playersData[index];
    const lastRollCount = player.evaluationResults[player.evaluationResults.length - 1].length;
    player.diceCount = lastRollCount;
}

// Fungsi untuk membagikan dadu
function shareDice(): void {
    playersData.forEach((player, index) => {
        if (player.diceToShare > 0) {
            const nextPlayerIndex = (index + 1) % playersData.length;
            const nextPlayer = playersData[nextPlayerIndex];
            nextPlayer.diceCount += player.diceToShare;
            for (let i = 0; i < player.diceToShare; i++) {
                nextPlayer.evaluationResults[nextPlayer.evaluationResults.length - 1].push(1);
            }
            player.diceToShare = 0;
        }
    });
}

// Fungsi untuk melanjutkan permainan atau menampilkan hasil
function randomize(): void {
    const activePlayersCount = playersData.filter(player => player.diceCount > 0).length;

    if (activePlayersCount > 1) {
        playGame();
    } else {
        const remainingPlayers = playersData.filter(player => player.diceCount > 0);
        if (remainingPlayers.length === 1) {
            console.log(`Game berakhir karena hanya pemain #${playersData.indexOf(remainingPlayers[0]) + 1} yang memiliki dadu.`);
        } else {
            console.log('Permainan berakhir karena hanya satu pemain yang memiliki sisa dadu.');
        }
        displayResults();
    }
}

// Fungsi untuk menampilkan hasil permainan
function displayResults(): void {
    const totalRounds = playersData[0].diceResults.length;

    for (let round = 0; round < totalRounds; round++) {
        // Display results in the console
        console.log(`Giliran ${round + 1} lempar dadu:`);

        playersData.forEach((player, index) => {
            if (player.diceCount > 0) {
                console.log(`Pemain #${index + 1} (${player.pointsHistory[round]}): ${player.diceResults[round].join(', ')}`);
            } else {
                console.log(`Pemain #${index + 1} _ (Berhenti bermain karena tidak memiliki dadu)`);
            }
        });

        console.log('Setelah Evaluasi:');
        playersData.forEach((player, index) => {
            if (player.diceCount > 0) {
                console.log(`Pemain #${index + 1} (${player.pointsHistory[round]}): ${player.evaluationResults[round].join(', ')}`);
            } else {
                console.log(`Pemain #${index + 1} _ (Berhenti bermain karena tidak memiliki dadu)`);
            }
        });

        console.log('==================');

        // Display results in HTML
        const generateRollResultsHtml = (round: number): string => {
            let html = '<ul>';
            playersData.forEach((player, index) => {
                html += `
                    <li>Pemain #${index + 1} (${round === 0 ? '0' : player.pointsHistory[round - 1]}): ${player.diceResults[round].join(', ')}</li>
                `;
            });
            html += '</ul>';
            return html;
        };

        const generateEvaluationResultsHtml = (round: number): string => {
            let html = '<ul>';
            playersData.forEach((player, index) => {
                html += `
                    <li>Pemain #${index + 1} (${player.pointsHistory[round]}): ${player.evaluationResults[round].join(', ')}</li>
                `;
            });
            html += '</ul>';
            return html;
        };

        const resultsHtml = `
            <div class="round">
                <div class="garis"></div>
                <b>Giliran ${round + 1} lempar dadu:</b>
                ${generateRollResultsHtml(round)}
                <b>Setelah Evaluasi:</b>
                ${generateEvaluationResultsHtml(round)}
            </div>
        `;

        const gameResultDiv = document.getElementById('game-result');
        if (gameResultDiv) {
            gameResultDiv.innerHTML += resultsHtml;
        }
    }

    // Find Winner
    let winnerIndex = 0;
    let highestPoints = 0;

    playersData.forEach((player, index) => {
        if (player.points > highestPoints) {
            winnerIndex = index;
            highestPoints = player.points;
        }
    });

    const winnerResultP = document.getElementById('winner-result') as HTMLParagraphElement;
    if (winnerResultP) {
        winnerResultP.innerHTML = `Game di menangkan oleh pemain #${winnerIndex + 1} dengan skor <b>${highestPoints}</b> memiliki poin lebih banyak dari pemain lainnya`;
    }

    // Display the result in the console
    console.log(`Game di menangkan oleh pemain #${winnerIndex + 1} dengan skor ${highestPoints} memiliki poin lebih banyak dari pemain lainnya`);
}
