const storage = window.localStorage;

const $diaryContent = $('#diaryContent');

$(document).ready(function () {
  $diaryContent.summernote({
    lang: 'ko-KR',
    height: 250,
  });

  // document.querySelector('#saveButton').addEventListener('click', saveDiary);
  $('#saveButton').on('click', saveDiary);
  // document.querySelector('#loadButton').addEventListener('click', loadDiary);
  $('#loadButton').on('click', loadDiary);
  // document.getElementById('diaryDate').value = getTodayByFormattedDate();
  $('#diaryDate').val(getTodayByFormattedDate());
});

function saveDiary() {
  const date = $('#diaryDate').val();
  const title = $('#diaryTitle').val();
  const content = $diaryContent.val();

  if (date && title && content) {
    // truthy : ''(빈 문자열은) false로 간주
    const diaryEntity = {
      title: title,
      content: content,
    };

    debugger;

    if (storage.getItem(date)) {
      if (!confirm('해당 날짜에 이미 일기가 있습니다. 덮어쓰시겠습니까?')) {
        return;
      }
    }

    // localstorage 저장하기 전에 직렬화
    // 키값은 date를 yyyy-mm-dd 형식, value는 diaryEntity를 문자열로 직렬화
    storage.setItem(date, JSON.stringify(diaryEntity));

    alert('저장 성공');
  } else {
    alert('날짜, 제목, 내용은 필수입니다.');
  }
}

function loadDiary() {
  const date = $('#diaryDate').val();

  const savedStr = storage.getItem(date);

  if (savedStr) {
    const diaryEntity = JSON.parse(savedStr); // 문자열을 JSON으로 다시 파싱

    $('#diaryTitle').val(diaryEntity.title);
    $diaryContent.summernote('code', diaryEntity.content);
  } else {
    alert('해당 날짜에 저장된 일기가 없습니다.');
  }
}

function getTodayByFormattedDate() {
  const dateObject = new Date();

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`; // yyyy-mm-dd 문자열로 리턴
}
