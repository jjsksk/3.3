let buttons = [];
let inputBox; // 用於填空題的輸入框
let result = "";
let selectedAnswer = null; // 儲存使用者選擇的答案
let currentQuestion = ""; // 當前題目
let correctAnswer = null; // 正確答案
let questions; // 儲存題目資料
let currentIndex = 0; // 當前題目索引
let correctCount = 0; // 答對題數
let wrongCount = 0; // 答錯題數
let showResult = false; // 是否顯示答題結果

function preload() {
  questions = loadTable("questions.csv", "csv", "header", () => {
    console.log("CSV Loaded Successfully");
  }, () => {
    console.error("Failed to load CSV");
  });
}

function setup() {
  // 產生一個全視窗畫布
  createCanvas(windowWidth, windowHeight);
  // 設定背景顏色#fefae0
  background('#fefae0');
  
  // 載入第一題
  loadQuestion(currentIndex);
}

function draw() {
  // 設定背景顏色#fefae0
  background('#fefae0');
  
  // 設定填充顏色#e9edc9
  fill('#e9edc9');
  
  // 繪製矩形於全視窗寬的1/2與全視窗高的1/2
  rectMode(CENTER);
  rect(windowWidth / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2);
  
  // 顯示題目或結果
  fill('#d4a373');
  textSize(35);
  textAlign(CENTER, CENTER);
  if (currentIndex < questions.getRowCount()) {
    if (!showResult) {
      // 顯示題目
      text(currentQuestion, windowWidth / 2, windowHeight / 2 - 50);
    } else {
      // 顯示答題結果
      text(result, windowWidth / 2, windowHeight / 2 - 50);
    }
  } else {
    // 顯示作答結果
    text(`作答結束！`, windowWidth / 2, windowHeight / 2 - 50);
    text(`答對：${correctCount} 題`, windowWidth / 2, windowHeight / 2);
    text(`答錯：${wrongCount} 題`, windowWidth / 2, windowHeight / 2 + 50);
    
    // 顯示「再試一次」按鈕
    if (buttons.length === 0) {
      let retryButton = createButton("再試一次");
      retryButton.position(windowWidth / 2 - 50, windowHeight / 2 + 100);
      retryButton.size(100, 40);
      retryButton.mousePressed(restartQuiz);
      buttons.push(retryButton);
    }
  }
}

function loadQuestion(index) {
  // 清除按鈕和輸入框
  buttons.forEach(btn => btn.remove());
  if (inputBox) inputBox.remove();
  buttons = [];
  
  if (index < questions.getRowCount()) {
    // 載入題目與答案
    currentQuestion = questions.getString(index, "question");
    correctAnswer = questions.getString(index, "answer"); // 將答案作為字串處理
    let type = questions.getString(index, "type"); // 題目類型 (選擇題或填空題)
    
    console.log(`Question Type: ${type}`);
    
    if (type === "choice") {
      // 如果是選擇題，生成選項按鈕
      let options = [1, 2, 3, 4];
      let buttonWidth = 50;
      let buttonHeight = 30;
      let spacing = 10; // 按鈕間距
      let startX = windowWidth / 2 - (options.length * (buttonWidth + spacing)) / 2;
      let startY = windowHeight / 2 + 50;

      for (let i = 0; i < options.length; i++) {
        let btn = createButton(options[i]);
        btn.position(startX + i * (buttonWidth + spacing), startY);
        btn.size(buttonWidth, buttonHeight);
        btn.mousePressed(() => {
          selectedAnswer = options[i]; // 設定選擇的答案
          checkAnswer(); // 檢查答案
          showResult = true; // 顯示結果
        });
        buttons.push(btn);
      }
    } else if (type === "fill") {
      // 如果是填空題，生成輸入框
      inputBox = createInput();
      inputBox.position(windowWidth / 2 - 75, windowHeight / 2 + 20);
      inputBox.size(150);
      
      // 產生送出按鈕
      let submitButton = createButton("送出");
      submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 70);
      submitButton.size(100, 40);
      submitButton.mousePressed(() => {
        selectedAnswer = inputBox.value(); // 獲取使用者輸入的答案
        selectedAnswer = parseInt(selectedAnswer);
        checkAnswer();
        showResult = true;
      });
      buttons.push(submitButton);
    }

    // 產生下一題按鈕
    let nextButton = createButton("下一題");
    nextButton.position(windowWidth / 2 - 50, windowHeight / 2 + 120);
    nextButton.size(100, 40);
    nextButton.mousePressed(() => {
      if (showResult) {
        // 如果已顯示結果，進入下一題
        showResult = false;
        result = "";
        selectedAnswer = null;
        currentIndex++;
        loadQuestion(currentIndex);
      }
    });
    buttons.push(nextButton);
  }
}

function checkAnswer() {
  if (selectedAnswer == correctAnswer) { // 使用 == 比較，因為答案可能是字串或數字
    result = "答對了";
    correctCount++;
  } else {
    result = "答錯了";
    wrongCount++;
  }
}

function restartQuiz() {
  // 重置所有變數
  currentIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  result = "";
  showResult = false;
  selectedAnswer = null;
  
  // 清除按鈕和輸入框
  buttons.forEach(btn => btn.remove());
  if (inputBox) inputBox.remove();
  buttons = [];
  
  // 載入第一題
  loadQuestion(currentIndex);
}