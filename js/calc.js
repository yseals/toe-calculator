// @ts-check

const btnTireCalc = 
  /** @type {HTMLButtonElement} */
  (document.getElementById('btn-tire-calc'));

const btnDiameterCalc = 
  /** @type {HTMLButtonElement} */
  (document.getElementById('btn-diameter-calc'));


const inpTireWidth = 
  /** @type {HTMLInputElement} */
  (document.getElementById('inp-tire-width'));
const inpTireRatio = 
  /** @type {HTMLInputElement} */
  (document.getElementById('inp-tire-ratio'));
const inpTireInch = 
  /** @type {HTMLInputElement} */
  (document.getElementById('inp-tire-inch'));

  const inpDiameter = 
  /** @type {HTMLInputElement} */
  (document.getElementById('inp-diameter'));

const msgTireInputError = 
  /** @type {HTMLLabelElement} */
  (document.getElementById('msg-tire-input-error'))

const msgDiameterInputError = 
  /** @type {HTMLLabelElement} */
  (document.getElementById('msg-diameter-input-error'))

// テーブルの初回生成要否フラグ
let m_IsTableFirst = true;

/**
 * タイヤサイズの計算ボタンにクリックイベントを追加
 */
btnTireCalc.addEventListener('click', () => {
  let isError = false;
  if(inpTireWidth.checkValidity() == false)
  {
    inpTireWidth.classList.add('error');
    isError = true;
  }
  else
  {
    inpTireWidth.classList.remove('error');
  }

  if(inpTireRatio.checkValidity() == false)
  {
    inpTireRatio.classList.add('error');
    isError = true;
  }
  else
  {
    inpTireRatio.classList.remove('error');
  }

  if(inpTireInch.checkValidity() == false)
  {
    inpTireInch.classList.add('error');
    isError = true;
  }
  else
  {
    inpTireInch.classList.remove('error');
  }

  if(isError == true)
  {
    // エラーメッセージを表示
    msgTireInputError.classList.add('show');
    return;
  }
  msgTireInputError.classList.remove('show');

  // inputから値を取得 (取得した値は文字列なので数値に変換)
  const tw = Number(inpTireWidth.value);
  const tr = Number(inpTireRatio.value);
  const ti = Number(inpTireInch.value);

  // 中心からの距離を計算
  // タイヤ幅 * 扁平率
  // 1インチ = 25.4mm、その半分が半径
  const tireTick = tw * (tr / 100);
  const wheelTick = ti * 25.4 / 2;
  const radius = tireTick + wheelTick;
  const diameter = radius * 2;

  // 中心からの距離を元にテーブル作成
  const colname = inpTireWidth.value + "/" + inpTireRatio.value + "R" + inpTireInch.value;
  createTable(colname, diameter);
});


/**
 * 直径の計算ボタンにクリックイベントを追加
 */
btnDiameterCalc.addEventListener('click', () => {
  let isError = false;
  if(inpDiameter.checkValidity() == false)
  {
    inpDiameter.classList.add('error');
    isError = true;
  }
  else
  {
    inpDiameter.classList.remove('error');
  }

  if(isError == true)
  {
    // エラーメッセージを表示
    msgDiameterInputError.classList.add('show');
    return;
  }
  msgDiameterInputError.classList.remove('show');

  // inputから値を取得 (取得した値は文字列なので数値に変換)
  const diameter = Number(inpDiameter.value);

  // 中心からの距離を元にテーブル作成
  const colname = diameter.toString() + "mm";
  createTable(colname, diameter);
});


/**
 * テーブル生成
 * @param {string} name 設定名
 * @param {number} diameter 直径(mm)
 */
function createTable(name, diameter) {
  let table = null;
  const tcontainer = document.getElementById('table-container');

  if(m_IsTableFirst == true)
  {
    // table要素を作成
    table = document.createElement('table');
    
    // ヘッダー（thead）の作成 ---
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // ヘッダーに名前と1から20まで生成
    for (let i = 0; i <= 20; i++) {
      const thstr = document.createElement('th');
      if(i == 0)
      {
        thstr.textContent = "計算基準";
      }
      else
      {
        thstr.textContent = i.toString();
      }
      headerRow.appendChild(thstr);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // ボディの作成（行を追加していく場所）
    const tbody = document.createElement('tbody');
    tbody.id = 'table-body';
    table.appendChild(tbody);
    
    // コンテナにテーブルを配置
    tcontainer?.appendChild(table);
    m_IsTableFirst = false;
  }

  // 2回目以降 tbodyに行（tr）を追加する
  const tbody = document.getElementById('table-body');
  
  // 0から20まで繰り返す
  const row = document.createElement('tr');
  for (let i = 0; i <= 20; i++) {
    const tdstr = document.createElement('td');
    if(i == 0)
    {
      tdstr.textContent = name;
    }
    else
    {
      // 度と分を合わせたトータルの「度」を計算（分は60で割る）
      const totalDegrees = i / 60;
    
      // 度をラジアンに変換
      const radians = totalDegrees * (Math.PI / 180);
    
      // mmを計算 (外径 × tan)
      const mmVal = diameter * Math.tan(radians);
    
      // 小数点第2位で四捨五入
      tdstr.textContent = mmVal.toFixed(2);
    }
    row.appendChild(tdstr);
    tbody?.appendChild(row);
  }
}
