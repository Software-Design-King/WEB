# Test info

- Name: 학생 대시보드 >> 로그인한 학생은 대시보드 진입 시 이름, 인사말, 알림센터 노출
- Location: /Users/kwon/Desktop/project/software-design/WEB/tests/student-dashboard.spec.ts:9:3

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="username"]')

    at /Users/kwon/Desktop/project/software-design/WEB/tests/student-dashboard.spec.ts:11:16
```

# Page snapshot

```yaml
- heading "인천대학교 학생 관리 시스템" [level=1]
- paragraph: 카카오 계정으로 로그인하여 시작하세요
- button "카카오 계정으로 로그인"
- paragraph: 인천대학교 학생 관리 시스템 | Software Design King
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('학생 대시보드', () => {
   4 |   test('비로그인 사용자는 접근 시 로그인 페이지로 이동', async ({ page }) => {
   5 |     await page.goto('/student/dashboard');
   6 |     await expect(page).toHaveURL(/login/);
   7 |   });
   8 |
   9 |   test('로그인한 학생은 대시보드 진입 시 이름, 인사말, 알림센터 노출', async ({ page }) => {
  10 |     await page.goto('/login');
> 11 |     await page.fill('input[name="username"]', 'student1');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  12 |     await page.fill('input[name="password"]', 'password1');
  13 |     await page.click('button[type="submit"]');
  14 |     await expect(page).toHaveURL('/student/dashboard');
  15 |     await expect(page.locator('.user-greeting')).toContainText('student1');
  16 |     await expect(page.locator('.alert-center')).toBeVisible();
  17 |   });
  18 | });
  19 |
```