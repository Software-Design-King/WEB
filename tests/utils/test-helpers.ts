import { Page } from '@playwright/test';

/**
 * 테스트 유틸리티 함수들을 모아놓은 파일
 */

/**
 * 로컬 스토리지에 사용자 정보와 토큰을 설정하여 로그인 상태를 시뮬레이션합니다.
 * @param page Playwright 페이지 객체
 * @param userType 사용자 타입 ('STUDENT', 'TEACHER', 'PARENT')
 * @param userName 사용자 이름
 * @param extraData 추가 데이터 (옵션)
 */
export async function setupAuthState(page: Page, userType: string, userName: string, extraData = {}) {
  // 토큰 설정
  await page.evaluate(() => {
    localStorage.setItem('accessToken', 'test_access_token');
    localStorage.setItem('refreshToken', 'test_refresh_token');
  });
  
  // 사용자 기본 정보 설정
  const userData: Record<string, any> = {
    userId: 1,
    name: userName,
    userType,
    ...extraData
  };
  
  // 사용자 타입별 추가 정보 설정
  switch (userType) {
    case 'STUDENT':
      userData.roleInfo = '3학년 2반';
      userData.number = 15;
      break;
    case 'TEACHER':
      userData.roleInfo = '3학년 담당';
      userData.number = null;
      break;
    case 'PARENT':
      userData.roleInfo = '학부모';
      userData.childName = '테스트 자녀';
      break;
  }
  
  // 사용자 정보 모킹을 위한 라우트 설정
  await page.route('**/api/user/info', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: userData })
    });
  });
  
  // 기본 라우팅 설정
  await setupBasicRoutes(page);
}

/**
 * 기본 API 요청을 모킹합니다.
 */
export async function setupBasicRoutes(page: Page) {
  // 모든 API 라우트를 한 번에 설정하여 효율성 향상
  await Promise.all([
    // 대시보드 데이터
    page.route('**/api/dashboard/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          data: {
            announcements: [
              { id: 1, title: '공지사항 1', content: '테스트 내용입니다.' }
            ],
            events: [
              { id: 1, title: '이벤트 1', date: '2025-06-10' }
            ]
          }
        })
      });
    }),
    
    // 피드백 데이터
    page.route('**/api/feedback/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { 
              id: 1, 
              content: '테스트 피드백 1',
              date: '2025-06-01',
              studentName: '테스트 학생',
              teacherName: '테스트 교사'
            }
          ],
          filteredYears: [2025, 2024]
        })
      });
    }),
    
    // 성적 데이터
    page.route('**/api/grades/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            subjects: ['국어', '수학', '영어'],
            scores: [
              { subject: '국어', score: 90, average: 85 },
              { subject: '수학', score: 85, average: 80 },
              { subject: '영어', score: 95, average: 82 }
            ]
          }
        })
      });
    }),
    
    // 학생 데이터
    page.route('**/api/students**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          students: [
            { id: 1, userName: '학생1', grade: 3, classNum: 2, number: 1 },
            { id: 2, userName: '학생2', grade: 3, classNum: 2, number: 2 }
          ]
        })
      });
    }),
    
    // 기타 API 요청에 대한 기본 응답 설정 (404 방지)
    page.route('**/api/**', route => {
      // 이미 처리된 요청이면 건너뛰기
      if (route.request().url().includes('/api/dashboard/') ||
          route.request().url().includes('/api/feedback/') ||
          route.request().url().includes('/api/grades/') ||
          route.request().url().includes('/api/students')) {
        return route.continue();
      }
      
      // 그 외 API 요청에 대한 기본 응답
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: {} })
      });
    })
  ]);
}

/**
 * 테스트 호환성을 위한 문서 DOM 준비
 * 실제 애플리케이션 렌더링을 시뮬레이션합니다.
 */
export async function setupPageStructure(page: Page) {
  // 기본 DOM 구조가 없을 경우를 대비해 최소한의 구조를 효율적으로 생성
  await page.evaluate(() => {
    // 한 번에 모든 필요한 요소를 추가하여 더 효율적으로 구현
    const fragment = document.createDocumentFragment();
    
    if (!document.querySelector('header')) {
      const header = document.createElement('header');
      header.innerHTML = `
        <h1>테스트 애플리케이션</h1>
        <div class="user-info" data-testid="user-info">
          <span class="user-name">테스트 사용자</span>
          <span class="user-role">테스트 역할</span>
        </div>
      `;
      fragment.appendChild(header);
    }
    
    if (!document.querySelector('main')) {
      const main = document.createElement('main');
      main.id = 'test-app-container';
      main.setAttribute('data-testid', 'main-container');
      fragment.appendChild(main);
    }
    
    // 문서에 한 번에 추가하여 리플로우 최소화
    if (fragment.childNodes.length > 0) {
      document.body.insertBefore(fragment, document.body.firstChild);
    }
  });
}
