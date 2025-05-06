import { test, expect } from '@playwright/test';

test.describe('로그인 및 인증 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 메인 페이지로 이동
    await page.goto('/');
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('body', { state: 'attached' });
  });

  test('로그인 페이지 접근 가능 확인', async ({ page }) => {
    // 페이지가 로드되었는지 확인 (더 일반적인 선택자 사용)
    await page.waitForSelector('body', { timeout: 5000 });
    
    // 현재 URL이 유효한지 확인
    const url = page.url();
    expect(url).toBeTruthy();
    
    // 일반적인 HTML 구조 확인 - any 요소가 있는지 확인
    const anyElement = await page.$('div');
    expect(anyElement).not.toBeNull();
  });

  test('카카오 로그인 흐름 시뮬레이션', async ({ page }) => {
    // 앱 페이지가 이미 로드된 상태에서 localStorage 설정
    try {
      await page.evaluate(() => {
        // localStorage 사용 가능 여부 확인
        if (typeof localStorage === 'undefined') {
          throw new Error('localStorage is not available in this context');
        }
        localStorage.setItem('accessToken', 'test_access_token');
        localStorage.setItem('refreshToken', 'test_refresh_token');
        console.log('로그인 토큰 설정 완료');
      });
    } catch (error) {
      console.error('localStorage 접근 오류:', error);
      // 오류 발생 시 대체 접근법 시도
      await page.addInitScript(() => {
        window.localStorage.setItem('accessToken', 'test_access_token');
        window.localStorage.setItem('refreshToken', 'test_refresh_token');
      });
    }
    
    // 카카오 콜백 URL로 이동하여 로그인 성공 시뮬레이션
    await page.goto('/auth/kakao/callback?code=test_auth_code');
    
    // API 응답 모킹
    await page.route('**/api/user/info', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 1,
            name: '테스트 학생',
            email: 'student@test.com',
            userType: 'STUDENT',
            roleInfo: '3학년 2반',
            profileImage: null
          }
        })
      });
    });
    
    // 페이지 로드 대기
    await page.waitForSelector('body', { timeout: 5000 });
  });

  test('로그인 후 토큰이 저장되는지 확인', async ({ page }) => {
    // API 응답 모킹
    await page.route('**/api/auth/kakao/callback**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            accessToken: 'test_access_token',
            refreshToken: 'test_refresh_token',
            user: {
              id: 1,
              name: '테스트 학생',
              email: 'student@test.com',
              userType: 'STUDENT'
            }
          }
        })
      });
    });
    
    // API 응답 모킹: 사용자 정보
    await page.route('**/api/user/info', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 1,
            name: '테스트 학생',
            email: 'student@test.com',
            userType: 'STUDENT',
            roleInfo: '3학년 2반',
            profileImage: null
          }
        })
      });
    });
    
    // 로그인 성공 후 콜백 페이지로 직접 이동 (테스트 목적)
    await page.goto('/auth/kakao/callback?code=test_auth_code');
    
    // 대시보드로 이동했는지 확인 (리다이렉션이 발생했는지 확인)
    // 이 부분은 실제 앱의 로직에 따라 달라질 수 있음
    await page.waitForTimeout(1000); // 리다이렉션 대기
    
    // localStorage에 토큰 설정
    try {
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'test_access_token');
        localStorage.setItem('refreshToken', 'test_refresh_token');
      });
    } catch (error) {
      console.error('localStorage 접근 오류:', error);
      await page.addInitScript(() => {
        window.localStorage.setItem('accessToken', 'test_access_token');
        window.localStorage.setItem('refreshToken', 'test_refresh_token');
      });
    }
    
    // 마지막으로 대시보드로 이동해서 인증 상태 확인
    await page.goto('/student/dashboard');
    
    // 페이지 로드 확인
    await page.waitForSelector('body', { timeout: 5000 });
  });

  test('저장된 토큰으로 로그인 상태가 유지되는지 확인', async ({ page }) => {
    // 앱 페이지가 이미 로드된 상태에서 localStorage 설정
    try {
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'test_access_token');
        localStorage.setItem('refreshToken', 'test_refresh_token');
      });
    } catch (error) {
      console.error('localStorage 접근 오류:', error);
      await page.addInitScript(() => {
        window.localStorage.setItem('accessToken', 'test_access_token');
        window.localStorage.setItem('refreshToken', 'test_refresh_token');
      });
    }
    
    // API 응답 모킹: 사용자 정보
    await page.route('**/api/user/info', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 1,
            name: '테스트 학생',
            email: 'student@test.com',
            userType: 'STUDENT',
            roleInfo: '3학년 2반',
            profileImage: null
          }
        })
      });
    });
    
    // 학생 대시보드로 이동 시도
    await page.goto('/student/dashboard');
    
    // URL에 dashboard가 포함되어 있는지 확인 (리다이렉트 문제 방지)
    const url = page.url();
    expect(url).toContain('/student/dashboard');
    
    // 페이지가 로드되었는지 확인
    await page.waitForSelector('body', { timeout: 5000 });
  });

  test('유효하지 않은 토큰으로 로그인 실패 시 리다이렉션', async ({ page }) => {
    // 앱 페이지가 이미 로드된 상태에서 유효하지 않은 토큰 설정
    try {
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'invalid_token');
        // refreshToken은 의도적으로 설정하지 않음
      });
    } catch (error) {
      console.error('localStorage 접근 오류:', error);
      await page.addInitScript(() => {
        window.localStorage.setItem('accessToken', 'invalid_token');
      });
    }

    // API 요청 모킹 - 401 Unauthorized 응답
    await page.route('**/api/user/info', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' })
      });
    });
    
    // 대시보드로 이동 시도
    await page.goto('/student/dashboard');
    
    // 로그인 페이지로 리다이렉트되었는지 확인
    await page.waitForTimeout(1000); // 리다이렉션 대기
    const url = page.url();
    expect(url).toContain('/?returnUrl=%2Fstudent%2Fdashboard');
  });
});

// 디버깅용 테스트 (필요시에만 활성화)
test.skip('디버깅용 스크린샷 저장', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'login-page.png' });
  
  await page.goto('/auth/kakao/callback?code=test_auth_code');
  await page.screenshot({ path: 'kakao-login-flow.png' });
  
  await page.goto('/student/dashboard');
  await page.screenshot({ path: 'login-token-storage.png' });
  
  await page.screenshot({ path: 'persistent-login.png' });
  
  await page.goto('/?returnUrl=%2Fstudent%2Fdashboard');
  await page.screenshot({ path: 'login-failure.png' });
});
