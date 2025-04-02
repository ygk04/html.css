const pageSize = 10; // 페이지의 객체 수
const pagesPerSet = 5; // css Pagination의 한 세트당 페이지 수

let posts;
let totalPage = Number.MAX_SAFE_INTEGER;
let currentPage;
let startPage;
let endPage;

const $tbody = $('tbody');
const $pagination = $('.pagination');

// document.addEventListener('DOMContentLoaded'를 아래 jquery 문법으로 대체
$(document).ready(() => {
  loadPage(1); // 1페이지를 로딩해라
});

function loadPage(number) {
  if (number >= 1 && number <= totalPage) {
    currentPage = number;
  } else if (number < 1) {
    alert('이전 페이지가 없습니다.');
    return;
  } else {
    alert('다음 페이지가 없습니다.');
    return;
  }

  $.ajax({
    type: 'get',
    url: 'https://jsonplaceholder.typicode.com/posts', // 대체 예정
    async: true, // 비동기 통신할거니?
    success: function (data) {
      data.sort((a, b) => b.id - a.id); // id 기준 역순 정렬
      posts = data;

      if (posts) {
        reset(); // 테이블과 페이지네이션 초기화
        setBoard(); // 테이블에 데이터 세팅
        setPagination(); // 페이지네이션 세팅
      }
    },
    error: function (request, status, error) {
      console.log(error);
    },
  });
}

function reset() {
  $tbody.empty(); // $('tbody').empty()로 하면 글로벌 변수 사용 안해도 됨
  $pagination.empty();
}

function setBoard() {
  totalPage = Math.ceil(posts.length / pageSize); // 총 페이지 개수 계산(올림)

  const startIndex = (currentPage - 1) * pageSize; // 1 페이지라면 index 0번부터
  const endIndex = currentPage * pageSize; // 1페이지라면 index 10번 (10번 제외)

  posts.slice(startIndex, endIndex).forEach((post) => {
    const $tr = $('<tr></tr>'); // document.createElement('tr');
    const $tdId = $('<td></td>').text(post.id);
    const $tdTitle = $('<td></td>').text(post.title);
    const $tdCreatedAt = $('<td></td>').text(
      new Date(post.createdAt).toLocaleDateString()
    );
    const $tdDelete = $(
      '<td><button class="btn btn-danger" onclick="deleteRow(this)">삭제</a></td>'
    );

    $tr.append($tdId, $tdTitle, $tdCreatedAt, $tdDelete);
    $tbody.append($tr);
  });
}

function setPagination() {
  startPage = Math.max(
    1,
    Math.floor((currentPage - 1) / pagesPerSet) * pagesPerSet + 1
  );
  endPage = Math.min(totalPage, startPage + pagesPerSet - 1);

  const $previous = $(
    `<li><a href="javascript:loadPage(
      ${startPage - pagesPerSet}
    )" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>`
  );
  const $next = $(
    `<li><a href="javascript:loadPage(${
      endPage + 1
    })" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`
  );

  let count = 1;

  for (let i = startPage; i <= endPage; i++) {
    const $page = $(
      `<li ${
        currentPage === i ? 'class="active"' : ''
      }><a href="javascript:loadPage(${i})">${i}</a></li>`
    );
    $pagination.append($page);
  }

  $pagination.prepend($previous);
  $pagination.append($next);
}

function deleteRow(e) {
  // e.parentElement.parentElement.remove(); // <button>의 부모는 <td> 부모는 <tr>;
  $(e).closest('tr').remove();

  // 사실 여기서는 api에 삭제를 요청하는 로직을 생략
}
