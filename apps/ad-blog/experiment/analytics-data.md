# GA4·Cloudflare 데이터 목록과 활용 (ToolProof 운영 실험)

2026-11-10에 API로 직접 확인한 목록입니다: GA4는 Data API `metadata`(속성 486901575), Cloudflare는 GraphQL 스키마 조회(Account Analytics Read 토큰). 목록이 바뀌었는지 볼 때는 같은 방법으로 다시 조회합니다. 대시보드 문서 구조는 [tools/dashboard_data.py](tools/dashboard_data.py) 맨 위 설명.

## 활용 요약

| 목적 | 데이터 (출처) | 대시보드 | 판단에 쓰는 곳 |
| --- | --- | --- | --- |
| 실제 방문 수 | GA4 activeUsers·sessions·screenPageViews (운영자·헤드리스 제외) / Cloudflare 페이지 로드·방문 (봇·운영자 제외, 표본 ×10 추정) | 요약 카드 조회수, 방문자 | 목표 지표, AdSense 재신청 판단의 보조 |
| 재방문 | GA4 newVsReturning·sessionsPerUser | 방문자 | 반복 일정 글(노하우 4)·허브의 재방문 효과 |
| 체류·참여 | GA4 userEngagementDuration·engagedSessions·engagementRate·bounceRate·averageSessionDuration | 방문자, 첫 페이지, 글 상세, 그룹별 성과 | 가설 H3(검증형 글의 가치) 보조, 노하우 2(첫 문단에서 결과 제시) |
| 읽기 깊이 | GA4 scroll 이벤트 × percentScrolled 25·50·75·90 (25·50·75는 사이트 이벤트 2026-11-10부터) | 읽기 깊이, 글 상세, 그룹별 성과 | 노하우 7(짧고 이미지 많은 사용법 글), 본문 광고가 보일 위치까지 읽는지 |
| 유입 경로 | GA4 sessionSource·sessionMedium → 채널, firstUserSource·firstUserMedium / Cloudflare refererHost | 유입 경로, 첫 유입 채널, 리퍼러 | AI 답변 인용(writing-guide), 채널별 글 선정 |
| 첫 페이지 품질 | GA4 landingPage × 참여율·체류·이탈률 | 첫 페이지 | 제목·도입부 개선 대상 (개선 세션 4번) |
| 내부 이동 | GA4 pageReferrer(내 사이트) × pagePath | 내부 이동 | 노하우 9(클러스터 링크), 허브 → 상시 글 이동 |
| 외부 링크 클릭 | GA4 click 이벤트(향상된 측정) linkDomain·linkUrl | 외부 링크 클릭 | 검색 의도 충족(공식 다운로드·문서로 이동) |
| 기기·국가·시간대 | GA4 deviceCategory·countryId·operatingSystem·hour·dayOfWeek / Cloudflare deviceType·countryName·userAgentBrowser·userAgentOS·navigationType·datetimeHour | 기기·방문 국가·방문 시간대, 방문 환경 | 광고 단가(미국 비중), 모바일 광고 형식, 발행 시각 |
| Core Web Vitals | Cloudflare Web Vitals LCP·INP·CLS·FCP·TTFB 좋음/개선 필요/나쁨 수·p75·원인 요소, 성능 p75(페이지 로드·서버 응답·연결) | Core Web Vitals | Google 페이지 경험, 자동 광고가 만드는 CLS 감시 |
| 광고 | GA4 publisherAdImpressions·publisherAdClicks·totalAdRevenue·adFormat (AdSense를 GA4에 연결해야 채워짐) | 광고 | AdSense 승인 뒤 글별 광고 클릭률·수익 |
| 데이터 품질 | GA4 country·screenResolution, Cloudflare bot·countryName·sampleInterval | 방문자·조회수 카드 안내 | 모든 판단의 전제 (아래 규칙) |

## 데이터 품질 규칙 (2026-11-10)

- **운영자 제외**: 사이트는 영어·미국 대상이라 한국 방문은 운영자 확인으로 봄 (GA4 `country = South Korea`, Cloudflare `countryName = KR`). 2026-11-05~10 GA4 18세션 중 5세션
- **자동 방문 제외**: GA4 `screenResolution = 800x600`(헤드리스 브라우저 기본 화면, Council Bluffs 데이터센터·참여 0초 방문이 모두 이 크기) 5세션, Cloudflare `bot = 1`(ChromeHeadless 등)
- 대시보드의 GA4·Cloudflare 값은 모두 두 방문을 뺀 값이고, 뺀 수는 `audience.excluded`·`vitals.excluded`에 기록 (`ga_analytics.host_filter`, `cf_analytics.period_filter`)
- **Cloudflare 표본**: Web Analytics는 표본 수집(2026-11-10 기준 `sampleInterval` 10)이라 값이 10 단위 추정치. 조회수가 적은 동안 글별 Cloudflare 값으로 판단하지 않음
- **GA4 누락**: 동의 거부(유럽)·광고 차단 방문은 GA4에 없음 → 방문 규모는 Cloudflare, 행동(체류·스크롤·유입 경로)은 GA4로 봄. 두 출처의 국가 분포가 다를 수 있음(2026-11-10: Cloudflare 미국 추정 60, GA4 실제 독자 미국 0)

## 아직 못 쓰는 것

| 데이터 | 이유 | 쓰려면 |
| --- | --- | --- |
| GA4 Search Console 지표 (organicGoogleSearch*) | GA4에 Search Console 미연결 (API 400) | GA4 관리 → 제품 링크 → Search Console 연결 (선택. Search Console API를 직접 쓰고 있어 급하지 않음) |
| 광고 노출·클릭·수익 | AdSense 미승인·GA4 미연결 | AdSense 승인 뒤 GA4 관리 → 제품 링크 → AdSense 연결 (사용자). 수집 코드는 이미 있음 (`audience.ads`) |
| 스크롤 25·50·75% | 향상된 측정은 90%만 | 사이트 이벤트 추가 완료 (2026-11-10 배포 뒤부터 쌓임, `core/analytics/internal/scroll.ts`) |
| Bing 검색 노출·클릭 | Bing Webmaster Tools API 지원 종료 | 방문 기준(GA4·Cloudflare의 bing 유입)만 |
| Pinterest 핀 노출·저장 | Pinterest API 미연결 | Pinterest 개발자 앱·토큰 필요 (방문은 GA4 Pinterest 채널로 봄) |
| 인구통계 (나이·성별·관심분야) | Google 신호 필요, 적은 표본은 임계값으로 가려짐 | 방문이 많아진 뒤 Google 신호 활성화 검토 |
| AI 크롤러 방문 (GPTBot 등) | JS를 실행하지 않아 GA4·Cloudflare Web Analytics에 안 잡힘, 서버 로그 없음 | Vercel 로그 드레인(유료)이나 Cloudflare 프록시 도입 시 |

## GA4 전체 목록 (차원 375개 · 지표 89개)

**굵게** = 대시보드·판별에 쓰는 것.

### 차원 · Attribution (83)

쓰는 것: 세션 소스·매체(유입 채널). 안 씀: 캠페인·Google Ads·CM360·DV360·SA360·수동 캠페인(광고 캠페인·utm 캠페인을 운영하지 않음)

<details><summary>전체 83개</summary>

`campaignId`, `campaignName`, `cm360AccountId`, `cm360AccountName`, `cm360AdvertiserId`, `cm360AdvertiserName`, `cm360CampaignId`, `cm360CampaignName`, `cm360CreativeFormat`, `cm360CreativeId`, `cm360CreativeName`, `cm360CreativeType`, `cm360CreativeTypeId`, `cm360CreativeVersion`, `cm360Medium`, `cm360PlacementCostStructure`, `cm360PlacementId`, `cm360PlacementName`, `cm360RenderingId`, `cm360SiteId`, `cm360SiteName`, `cm360Source`, `cm360SourceMedium`, `defaultChannelGroup`, `dv360AdvertiserId`, `dv360AdvertiserName`, `dv360CampaignId`, `dv360CampaignName`, `dv360CreativeFormat`, `dv360CreativeId`, `dv360CreativeName`, `dv360ExchangeId`, `dv360ExchangeName`, `dv360InsertionOrderId`, `dv360InsertionOrderName`, `dv360LineItemId`, `dv360LineItemName`, `dv360Medium`, `dv360PartnerId`, `dv360PartnerName`, `dv360Source`, `dv360SourceMedium`, `googleAdsAccountName`, `googleAdsAdGroupId`, `googleAdsAdGroupName`, `googleAdsAdNetworkType`, `googleAdsCampaignId`, `googleAdsCampaignName`, `googleAdsCampaignType`, `googleAdsCreativeId`, `googleAdsCustomerId`, `googleAdsKeyword`, `googleAdsQuery`, `manualAdContent`, `manualCampaignId`, `manualCampaignName`, `manualCreativeFormat`, `manualMarketingTactic`, `manualMedium`, `manualSource`, `manualSourceMedium`, `manualSourcePlatform`, `manualTerm`, `medium`, `primaryChannelGroup`, `sa360AdGroupId`, `sa360AdGroupName`, `sa360CampaignId`, `sa360CampaignName`, `sa360CreativeFormat`, `sa360EngineAccountId`, `sa360EngineAccountName`, `sa360EngineAccountType`, `sa360KeywordText`, `sa360ManagerAccountId`, `sa360ManagerAccountName`, `sa360Medium`, `sa360Query`, `sa360Source`, `sa360SourceMedium`, `source`, `sourceMedium`, `sourcePlatform`

</details>

### 차원 · Cohort (4)

보류: 재방문은 newVsReturning으로 봄. 사용자가 수백 명 쌓이면 주별 재방문 코호트 후보

`cohort`, `cohortNthDay`, `cohortNthMonth`, `cohortNthWeek`

### 차원 · Demographics (3)

안 씀: Google 신호 활성화가 필요하고 적은 표본은 임계값으로 가려짐

`brandingInterest`, `userAgeBracket`, `userGender`

### 차원 · Ecommerce (22)

해당 없음 (판매 없음)

`currencyCode`, `itemAffiliation`, `itemBrand`, `itemCategory`, `itemCategory2`, `itemCategory3`, `itemCategory4`, `itemCategory5`, `itemId`, `itemListId`, `itemListName`, `itemListPosition`, `itemLocationID`, `itemName`, `itemPromotionCreativeName`, `itemPromotionCreativeSlot`, `itemPromotionId`, `itemPromotionName`, `itemVariant`, `orderCoupon`, `shippingTier`, `transactionId`

### 차원 · Event (2)

쓰는 것: eventName(수집 이벤트 확인: page_view·session_start·first_visit·user_engagement·scroll). isKeyEvent는 키 이벤트 미설정

**`eventName`**, `isKeyEvent`

### 차원 · Geography (7)

쓰는 것: countryId(국가, 미국 비중), country(운영자 판별). city는 데이터센터 방문 확인에만 씀

**`city`**, `cityId`, `continent`, `continentId`, **`country`**, **`countryId`**, `region`

### 차원 · Other (23)

쓰는 것: percentScrolled(스크롤 깊이), linkDomain·linkUrl·outbound(외부 링크 클릭). 안 씀: 파일 다운로드·사이트 검색·동영상(해당 기능 없음), 게임·테스트 데이터 차원

`achievementId`, `character`, `comparison`, `fileExtension`, `fileName`, `groupId`, `level`, `linkClasses`, **`linkDomain`**, `linkId`, `linkText`, **`linkUrl`**, `method`, **`outbound`**, **`percentScrolled`**, `searchTerm`, `testDataFilterId`, `testDataFilterName`, `videoProvider`, `videoTitle`, `videoUrl`, `virtualCurrencyName`, `visible`

### 차원 · Page / Screen (16)

쓰는 것: pagePath·landingPage·pageReferrer(내부 이동)·pageTitle·hostName(필터). 안 씀: contentGroup 등(미설정), 앱 화면 차원

`contentGroup`, `contentId`, `contentType`, `fullPageUrl`, **`hostName`**, **`landingPage`**, `landingPagePlusQueryString`, `pageLocation`, **`pagePath`**, `pagePathPlusQueryString`, **`pageReferrer`**, **`pageTitle`**, `unifiedPagePathScreen`, `unifiedPageScreen`, `unifiedScreenClass`, `unifiedScreenName`

### 차원 · Platform / Device (18)

쓰는 것: deviceCategory·operatingSystem·browser, screenResolution(헤드리스 800x600 판별). 안 씀: 앱 버전·기기 모델(웹 사이트, 표본 작음)

`appVersion`, **`browser`**, `browserVersion`, **`deviceCategory`**, `deviceModel`, `language`, `languageCode`, `mobileDeviceBranding`, `mobileDeviceMarketingName`, `mobileDeviceModel`, **`operatingSystem`**, `operatingSystemVersion`, `operatingSystemWithVersion`, `platform`, `platformDeviceCategory`, **`screenResolution`**, `streamId`, `streamName`

### 차원 · Publisher (3)

쓰는 것(AdSense 연결 후): adFormat. adUnitName·adSourceName은 수동 광고 단위를 쓰지 않아 보류

**`adFormat`**, `adSourceName`, `adUnitName`

### 차원 · Time (22)

쓰는 것: date·hour·dayOfWeek(한국 시간). 나머지는 같은 값의 다른 단위

**`date`**, `dateHour`, `dateHourMinute`, `day`, **`dayOfWeek`**, `dayOfWeekName`, **`hour`**, `isoWeek`, `isoYear`, `isoYearIsoWeek`, `minute`, `month`, `nthDay`, `nthHour`, `nthMinute`, `nthMonth`, `nthWeek`, `nthYear`, `week`, `year`, `yearMonth`, `yearWeek`

### 차원 · Traffic Source (166)

쓰는 것: sessionSource·sessionMedium(유입 경로), firstUserSource·firstUserMedium(첫 유입 채널). 안 씀: 캠페인·광고 플랫폼 계열(운영 안 함)

<details><summary>전체 166개</summary>

`firstUserCampaignId`, `firstUserCampaignName`, `firstUserCm360AccountId`, `firstUserCm360AccountName`, `firstUserCm360AdvertiserId`, `firstUserCm360AdvertiserName`, `firstUserCm360CampaignId`, `firstUserCm360CampaignName`, `firstUserCm360CreativeFormat`, `firstUserCm360CreativeId`, `firstUserCm360CreativeName`, `firstUserCm360CreativeType`, `firstUserCm360CreativeTypeId`, `firstUserCm360CreativeVersion`, `firstUserCm360Medium`, `firstUserCm360PlacementCostStructure`, `firstUserCm360PlacementId`, `firstUserCm360PlacementName`, `firstUserCm360RenderingId`, `firstUserCm360SiteId`, `firstUserCm360SiteName`, `firstUserCm360Source`, `firstUserCm360SourceMedium`, `firstUserDefaultChannelGroup`, `firstUserDv360AdvertiserId`, `firstUserDv360AdvertiserName`, `firstUserDv360CampaignId`, `firstUserDv360CampaignName`, `firstUserDv360CreativeFormat`, `firstUserDv360CreativeId`, `firstUserDv360CreativeName`, `firstUserDv360ExchangeId`, `firstUserDv360ExchangeName`, `firstUserDv360InsertionOrderId`, `firstUserDv360InsertionOrderName`, `firstUserDv360LineItemId`, `firstUserDv360LineItemName`, `firstUserDv360Medium`, `firstUserDv360PartnerId`, `firstUserDv360PartnerName`, `firstUserDv360Source`, `firstUserDv360SourceMedium`, `firstUserGoogleAdsAccountName`, `firstUserGoogleAdsAdGroupId`, `firstUserGoogleAdsAdGroupName`, `firstUserGoogleAdsAdNetworkType`, `firstUserGoogleAdsCampaignId`, `firstUserGoogleAdsCampaignName`, `firstUserGoogleAdsCampaignType`, `firstUserGoogleAdsCreativeId`, `firstUserGoogleAdsCustomerId`, `firstUserGoogleAdsKeyword`, `firstUserGoogleAdsQuery`, `firstUserManualAdContent`, `firstUserManualCampaignId`, `firstUserManualCampaignName`, `firstUserManualCreativeFormat`, `firstUserManualMarketingTactic`, `firstUserManualMedium`, `firstUserManualSource`, `firstUserManualSourceMedium`, `firstUserManualSourcePlatform`, `firstUserManualTerm`, **`firstUserMedium`**, `firstUserPrimaryChannelGroup`, `firstUserSa360AdGroupId`, `firstUserSa360AdGroupName`, `firstUserSa360CampaignId`, `firstUserSa360CampaignName`, `firstUserSa360CreativeFormat`, `firstUserSa360EngineAccountId`, `firstUserSa360EngineAccountName`, `firstUserSa360EngineAccountType`, `firstUserSa360KeywordText`, `firstUserSa360ManagerAccountId`, `firstUserSa360ManagerAccountName`, `firstUserSa360Medium`, `firstUserSa360Query`, `firstUserSa360Source`, `firstUserSa360SourceMedium`, **`firstUserSource`**, `firstUserSourceMedium`, `firstUserSourcePlatform`, `sessionCampaignId`, `sessionCampaignName`, `sessionCm360AccountId`, `sessionCm360AccountName`, `sessionCm360AdvertiserId`, `sessionCm360AdvertiserName`, `sessionCm360CampaignId`, `sessionCm360CampaignName`, `sessionCm360CreativeFormat`, `sessionCm360CreativeId`, `sessionCm360CreativeName`, `sessionCm360CreativeType`, `sessionCm360CreativeTypeId`, `sessionCm360CreativeVersion`, `sessionCm360Medium`, `sessionCm360PlacementCostStructure`, `sessionCm360PlacementId`, `sessionCm360PlacementName`, `sessionCm360RenderingId`, `sessionCm360SiteId`, `sessionCm360SiteName`, `sessionCm360Source`, `sessionCm360SourceMedium`, **`sessionDefaultChannelGroup`**, `sessionDv360AdvertiserId`, `sessionDv360AdvertiserName`, `sessionDv360CampaignId`, `sessionDv360CampaignName`, `sessionDv360CreativeFormat`, `sessionDv360CreativeId`, `sessionDv360CreativeName`, `sessionDv360ExchangeId`, `sessionDv360ExchangeName`, `sessionDv360InsertionOrderId`, `sessionDv360InsertionOrderName`, `sessionDv360LineItemId`, `sessionDv360LineItemName`, `sessionDv360Medium`, `sessionDv360PartnerId`, `sessionDv360PartnerName`, `sessionDv360Source`, `sessionDv360SourceMedium`, `sessionGoogleAdsAccountName`, `sessionGoogleAdsAdGroupId`, `sessionGoogleAdsAdGroupName`, `sessionGoogleAdsAdNetworkType`, `sessionGoogleAdsCampaignId`, `sessionGoogleAdsCampaignName`, `sessionGoogleAdsCampaignType`, `sessionGoogleAdsCreativeId`, `sessionGoogleAdsCustomerId`, `sessionGoogleAdsKeyword`, `sessionGoogleAdsQuery`, `sessionManualAdContent`, `sessionManualCampaignId`, `sessionManualCampaignName`, `sessionManualCreativeFormat`, `sessionManualMarketingTactic`, `sessionManualMedium`, `sessionManualSource`, `sessionManualSourceMedium`, `sessionManualSourcePlatform`, `sessionManualTerm`, **`sessionMedium`**, `sessionPrimaryChannelGroup`, `sessionSa360AdGroupId`, `sessionSa360AdGroupName`, `sessionSa360CampaignId`, `sessionSa360CampaignName`, `sessionSa360CreativeFormat`, `sessionSa360EngineAccountId`, `sessionSa360EngineAccountName`, `sessionSa360EngineAccountType`, `sessionSa360Keyword`, `sessionSa360ManagerAccountId`, `sessionSa360ManagerAccountName`, `sessionSa360Medium`, `sessionSa360Query`, `sessionSa360Source`, `sessionSa360SourceMedium`, **`sessionSource`**, `sessionSourceMedium`, `sessionSourcePlatform`

</details>

### 차원 · User (5)

쓰는 것: newVsReturning. 안 씀: 잠재고객·로그인 사용자 ID(미설정)

`audienceId`, `audienceName`, `audienceResourceName`, **`newVsReturning`**, `signedInWithUserId`

### 차원 · User Lifetime (1)

보류: firstSessionDate (재방문 분석이 의미 있을 만큼 쌓이면)

`firstSessionDate`

### 지표 · Cohort (2)

보류 (코호트 차원과 같은 이유)

`cohortActiveUsers`, `cohortTotalUsers`

### 지표 · Ecommerce (29)

해당 없음

`addToCarts`, `checkouts`, `ecommercePurchases`, `grossItemRevenue`, `grossPurchaseRevenue`, `itemDiscountAmount`, `itemListClickEvents`, `itemListClickThroughRate`, `itemListViewEvents`, `itemPromotionClickThroughRate`, `itemRefundAmount`, `itemRevenue`, `itemsAddedToCart`, `itemsCheckedOut`, `itemsClickedInList`, `itemsClickedInPromotion`, `itemsPurchased`, `itemsViewed`, `itemsViewedInList`, `itemsViewedInPromotion`, `itemViewEvents`, `promotionClicks`, `promotionViews`, `purchaseRevenue`, `refundAmount`, `shippingAmount`, `taxAmount`, `transactions`, `transactionsPerPurchaser`

### 지표 · Event (6)

쓰는 것: eventCount(스크롤·클릭), eventsPerSession. keyEvents는 키 이벤트 미설정

**`eventCount`**, `eventCountPerUser`, **`eventsPerSession`**, `eventValue`, `keyEvents`, `keyEvents:purchase`

### 지표 · Other (17)

쓰는 것: scrolledUsers, publisherAdClicks·publisherAdImpressions(AdSense 연결 후). 안 씀: organicGoogleSearch*(GA4에 Search Console 미연결 → Search Console API를 직접 씀), advertiser*(광고 집행 없음), 장바구니·앱 비정상 종료

`advertiserAdClicks`, `advertiserAdCost`, `advertiserAdCostPerClick`, `advertiserAdCostPerKeyEvent`, `advertiserAdImpressions`, `cartToViewRate`, `crashAffectedUsers`, `crashFreeUsersRate`, `organicGoogleSearchAveragePosition`, `organicGoogleSearchClicks`, `organicGoogleSearchClickThroughRate`, `organicGoogleSearchImpressions`, **`publisherAdClicks`**, **`publisherAdImpressions`**, `purchaseToViewRate`, `returnOnAdSpend`, **`scrolledUsers`**

### 지표 · Page / Screen (3)

쓰는 것: screenPageViews, screenPageViewsPerSession

**`screenPageViews`**, **`screenPageViewsPerSession`**, `screenPageViewsPerUser`

### 지표 · Publisher (1)

보류: adUnitExposure (수동 광고 단위 없음)

`adUnitExposure`

### 지표 · Revenue (6)

쓰는 것(AdSense 연결 후): totalAdRevenue. 구매 수익 지표는 해당 없음

`averagePurchaseRevenue`, `averagePurchaseRevenuePerPayingUser`, `averagePurchaseRevenuePerUser`, `averageRevenuePerUser`, **`totalAdRevenue`**, `totalRevenue`

### 지표 · Session (8)

쓰는 것: sessions·engagedSessions·engagementRate·bounceRate·averageSessionDuration·sessionsPerUser

**`averageSessionDuration`**, **`bounceRate`**, **`engagedSessions`**, **`engagementRate`**, `sessionKeyEventRate`, **`sessions`**, **`sessionsPerUser`**, `sessionKeyEventRate:purchase`

### 지표 · User (17)

쓰는 것: activeUsers·newUsers·totalUsers·userEngagementDuration. 보류: active1/7/28DayUsers·dauPerMau 등(표본이 작아 비율이 흔들림). 구매자 지표는 해당 없음

`active1DayUsers`, `active28DayUsers`, `active7DayUsers`, **`activeUsers`**, `dauPerMau`, `dauPerWau`, `firstTimePurchaserRate`, `firstTimePurchasers`, `firstTimePurchasersPerNewUser`, **`newUsers`**, `purchaserRate`, `totalPurchasers`, **`totalUsers`**, **`userEngagementDuration`**, `userKeyEventRate`, `wauPerMau`, `userKeyEventRate:purchase`

## Cloudflare 전체 목록

이 토큰(Account Analytics Read)으로 보이는 계정 데이터셋 257개 중 Web Analytics(RUM)는 4개(`rumPageloadEventsAdaptiveGroups`, `rumPerformanceEventsAdaptiveGroups`, `rumWebVitalsEventsAdaptive`, `rumWebVitalsEventsAdaptiveGroups`). 나머지는 Workers·R2·DNS·Zero Trust 등 다른 제품 데이터라 해당 없음 (사이트는 Vercel 호스팅이고 Cloudflare 프록시를 거치지 않아 HTTP 요청·봇 관리 같은 영역 데이터도 없음).

### PageloadEvents · Dimensions (25)

페이지 로드 차원. 쓰는 것: 경로·날짜·시간·리퍼러 호스트·국가·기기·브라우저·OS·이동 방식·봇(제외 필터). 안 씀: 브라우저 엔진·버전·OS 버전(표본 작음), refererPath(내부 이동은 GA4 pageReferrer로), deliveryType, SXG 태그

**`bot`**, `browserEngine`, `browserEngineVersion`, `browserVersion`, **`countryName`**, `customTagInternalSxg`, **`date`**, `datetimeFifteenMinutes`, `datetimeFiveMinutes`, `datetimeHalfOfHour`, **`datetimeHour`**, `datetimeMinute`, `deliveryType`, **`deviceType`**, **`navigationType`**, `osVersion`, **`refererHost`**, `refererPath`, `refererScheme`, **`requestHost`**, **`requestPath`**, `requestScheme`, **`siteTag`**, **`userAgentBrowser`**, **`userAgentOS`**

### PageloadEvents · Sum (1)

**`visits`**

### PageloadEvents · Avg (1)

**`sampleInterval`**

### PerformanceEvents · Dimensions (25)

**`bot`**, `browserEngine`, `browserEngineVersion`, `browserVersion`, **`countryName`**, `customTagInternalSxg`, **`date`**, `datetimeFifteenMinutes`, `datetimeFiveMinutes`, `datetimeHalfOfHour`, **`datetimeHour`**, `datetimeMinute`, `deliveryType`, **`deviceType`**, **`navigationType`**, `osVersion`, **`refererHost`**, `refererPath`, `refererScheme`, **`requestHost`**, **`requestPath`**, `requestScheme`, **`siteTag`**, **`userAgentBrowser`**, **`userAgentOS`**

### PerformanceEvents · Quantiles (84)

성능 백분위수. 쓰는 것: 페이지 로드·서버 응답·FCP·DNS·연결 p75. 나머지 백분위·단계는 문제가 보일 때 원인 분석용

<details><summary>전체 84개</summary>

`connectionTimeP25`, `connectionTimeP50`, **`connectionTimeP75`**, `connectionTimeP90`, `connectionTimeP95`, `connectionTimeP99`, `connectionTimeP999`, `connectionTimeWithoutTLSP25`, `connectionTimeWithoutTLSP50`, `connectionTimeWithoutTLSP75`, `connectionTimeWithoutTLSP90`, `connectionTimeWithoutTLSP95`, `connectionTimeWithoutTLSP99`, `connectionTimeWithoutTLSP999`, `dnsTimeP25`, `dnsTimeP50`, **`dnsTimeP75`**, `dnsTimeP90`, `dnsTimeP95`, `dnsTimeP99`, `dnsTimeP999`, `firstContentfulPaintP25`, `firstContentfulPaintP50`, **`firstContentfulPaintP75`**, `firstContentfulPaintP90`, `firstContentfulPaintP95`, `firstContentfulPaintP99`, `firstContentfulPaintP999`, `firstPaintP25`, `firstPaintP50`, `firstPaintP75`, `firstPaintP90`, `firstPaintP95`, `firstPaintP99`, `firstPaintP999`, `loadEventTimeP25`, `loadEventTimeP50`, `loadEventTimeP75`, `loadEventTimeP90`, `loadEventTimeP95`, `loadEventTimeP99`, `loadEventTimeP999`, `pageLoadTimeP25`, `pageLoadTimeP50`, **`pageLoadTimeP75`**, `pageLoadTimeP90`, `pageLoadTimeP95`, `pageLoadTimeP99`, `pageLoadTimeP999`, `pageRenderTimeP25`, `pageRenderTimeP50`, `pageRenderTimeP75`, `pageRenderTimeP90`, `pageRenderTimeP95`, `pageRenderTimeP99`, `pageRenderTimeP999`, `redirectTimeP25`, `redirectTimeP50`, `redirectTimeP75`, `redirectTimeP90`, `redirectTimeP95`, `redirectTimeP99`, `redirectTimeP999`, `requestTimeP25`, `requestTimeP50`, `requestTimeP75`, `requestTimeP90`, `requestTimeP95`, `requestTimeP99`, `requestTimeP999`, `responseTimeP25`, `responseTimeP50`, **`responseTimeP75`**, `responseTimeP90`, `responseTimeP95`, `responseTimeP99`, `responseTimeP999`, `tlsTimeP25`, `tlsTimeP50`, `tlsTimeP75`, `tlsTimeP90`, `tlsTimeP95`, `tlsTimeP99`, `tlsTimeP999`

</details>

### PerformanceEvents · Avg (13)

`connectionTime`, `connectionTimeWithoutTLS`, `dnsTime`, `firstContentfulPaint`, `firstPaint`, `loadEventTime`, `pageLoadTime`, `pageRenderTime`, `redirectTime`, `requestTime`, `responseTime`, **`sampleInterval`**, `tlsTime`

### PerformanceEvents · Sum (1)

**`visits`**

### WebVitalsEvents · Dimensions (40)

Web Vitals 차원. 쓰는 것: 경로·기기, LCP·CLS·INP 원인 요소. 안 씀: FID(INP로 대체된 지표), LCP 리소스 세부(문제가 보일 때)

**`bot`**, `browserEngine`, `browserEngineVersion`, `browserVersion`, **`countryName`**, **`cumulativeLayoutShiftElement`**, `cumulativeLayoutShiftPath`, `customTagInternalSxg`, **`date`**, `datetimeFifteenMinutes`, `datetimeFiveMinutes`, `datetimeHalfOfHour`, **`datetimeHour`**, `datetimeMinute`, `deliveryType`, **`deviceType`**, `firstInputDelayElement`, `firstInputDelayName`, `firstInputDelayPath`, **`interactionToNextPaintElement`**, `interactionToNextPaintName`, `interactionToNextPaintPath`, **`largestContentfulPaintElement`**, `largestContentfulPaintObjectHost`, `largestContentfulPaintObjectPath`, `largestContentfulPaintObjectScheme`, `largestContentfulPaintPath`, `lcpFetchPriority`, `lcpInitiatorType`, **`navigationType`**, `osVersion`, **`refererHost`**, `refererPath`, `refererScheme`, **`requestHost`**, **`requestPath`**, `requestScheme`, **`siteTag`**, **`userAgentBrowser`**, **`userAgentOS`**

### WebVitalsEvents · Sum (25)

Web Vitals 좋음/개선 필요/나쁨 수. 쓰는 것: LCP·INP·CLS·FCP·TTFB 세 단계 수 (쿼리당 필드 30개 제한이라 Total은 합으로 계산). FID는 안 씀

**`clsGood`**, **`clsNeedsImprovement`**, **`clsPoor`**, `clsTotal`, **`fcpGood`**, **`fcpNeedsImprovement`**, **`fcpPoor`**, `fcpTotal`, `fidGood`, `fidNeedsImprovement`, `fidPoor`, `fidTotal`, **`inpGood`**, **`inpNeedsImprovement`**, **`inpPoor`**, `inpTotal`, **`lcpGood`**, **`lcpNeedsImprovement`**, **`lcpPoor`**, `lcpTotal`, **`ttfbGood`**, **`ttfbNeedsImprovement`**, **`ttfbPoor`**, `ttfbTotal`, **`visits`**

### WebVitalsEvents · Quantiles (84)

Web Vitals 백분위수 (시간은 마이크로초). 쓰는 것: LCP·INP·CLS·FCP·TTFB p75. LCP·INP 세부 단계 백분위는 원인 분석용

<details><summary>전체 84개</summary>

`cumulativeLayoutShiftP25`, `cumulativeLayoutShiftP50`, **`cumulativeLayoutShiftP75`**, `cumulativeLayoutShiftP90`, `cumulativeLayoutShiftP95`, `cumulativeLayoutShiftP99`, `cumulativeLayoutShiftP999`, `firstContentfulPaintP25`, `firstContentfulPaintP50`, **`firstContentfulPaintP75`**, `firstContentfulPaintP90`, `firstContentfulPaintP95`, `firstContentfulPaintP99`, `firstContentfulPaintP999`, `firstInputDelayP25`, `firstInputDelayP50`, `firstInputDelayP75`, `firstInputDelayP90`, `firstInputDelayP95`, `firstInputDelayP99`, `firstInputDelayP999`, `inpInputDelayP25`, `inpInputDelayP50`, `inpInputDelayP75`, `inpInputDelayP90`, `inpInputDelayP95`, `inpInputDelayP99`, `inpInputDelayP999`, `inpPresentationDelayP25`, `inpPresentationDelayP50`, `inpPresentationDelayP75`, `inpPresentationDelayP90`, `inpPresentationDelayP95`, `inpPresentationDelayP99`, `inpPresentationDelayP999`, `inpProcessingDurationP25`, `inpProcessingDurationP50`, `inpProcessingDurationP75`, `inpProcessingDurationP90`, `inpProcessingDurationP95`, `inpProcessingDurationP99`, `inpProcessingDurationP999`, `interactionToNextPaintP25`, `interactionToNextPaintP50`, **`interactionToNextPaintP75`**, `interactionToNextPaintP90`, `interactionToNextPaintP95`, `interactionToNextPaintP99`, `interactionToNextPaintP999`, `largestContentfulPaintP25`, `largestContentfulPaintP50`, **`largestContentfulPaintP75`**, `largestContentfulPaintP90`, `largestContentfulPaintP95`, `largestContentfulPaintP99`, `largestContentfulPaintP999`, `lcpElementRenderDelayP25`, `lcpElementRenderDelayP50`, `lcpElementRenderDelayP75`, `lcpElementRenderDelayP90`, `lcpElementRenderDelayP95`, `lcpElementRenderDelayP99`, `lcpElementRenderDelayP999`, `lcpResourceLoadDelayP25`, `lcpResourceLoadDelayP50`, `lcpResourceLoadDelayP75`, `lcpResourceLoadDelayP90`, `lcpResourceLoadDelayP95`, `lcpResourceLoadDelayP99`, `lcpResourceLoadDelayP999`, `lcpResourceLoadTimeP25`, `lcpResourceLoadTimeP50`, `lcpResourceLoadTimeP75`, `lcpResourceLoadTimeP90`, `lcpResourceLoadTimeP95`, `lcpResourceLoadTimeP99`, `lcpResourceLoadTimeP999`, `timeToFirstByteP25`, `timeToFirstByteP50`, **`timeToFirstByteP75`**, `timeToFirstByteP90`, `timeToFirstByteP95`, `timeToFirstByteP99`, `timeToFirstByteP999`

</details>

### WebVitalsEvents · Avg (13)

`cumulativeLayoutShift`, `firstContentfulPaint`, `firstInputDelay`, `inpInputDelay`, `inpPresentationDelay`, `inpProcessingDuration`, `interactionToNextPaint`, `largestContentfulPaint`, `lcpElementRenderDelay`, `lcpResourceLoadDelay`, `lcpResourceLoadTime`, **`sampleInterval`**, `timeToFirstByte`

<details><summary>계정 데이터셋 전체 257개</summary>

`MagicWANConnectorMetricsAdaptiveGroups`, `accessLoginRequestsAdaptiveGroups`, `accountTag`, `advancedDnsProtectionNetworkAnalyticsAdaptiveGroups`, `advancedTcpProtectionNetworkAnalyticsAdaptiveGroups`, `aegisIpUtilizationAdaptiveGroups`, `agentMemoryOperationsAdaptiveGroups`, `agentModelInvocationsAdaptiveGroups`, `aiGatewayCacheAdaptiveGroups`, `aiGatewayConversationAnalysesAdaptive`, `aiGatewayConversationAnalysesAdaptiveGroups`, `aiGatewayConversationAnalysesStagingAdaptive`, `aiGatewayConversationAnalysesStagingAdaptiveGroups`, `aiGatewayErrorsAdaptiveGroups`, `aiGatewayRequestsAdaptiveGroups`, `aiGatewaySizeAdaptiveGroups`, `aiGatewaySpendSessionsAdaptiveGroups`, `aiGatewaySpendUserDailyAdaptiveGroups`, `aiInferenceAdaptive`, `aiInferenceAdaptiveGroups`, `aiSearchAPIAdaptiveGroups`, `aiSearchFulltextQueriesAdaptiveGroups`, `aiSearchImageProcessingTokensAdaptiveGroups`, `aiSearchIngestedItemsAdaptiveGroups`, `aiSearchIngestionTokensAdaptiveGroups`, `aiSearchMediaSecondsAdaptiveGroups`, `aiSearchPublicEventsAdaptiveGroups`, `aiSearchSemanticQueriesAdaptiveGroups`, `aiSearchStorageAdaptiveGroups`, `artifactsEventsAdaptiveGroups`, `artifactsStorageAdaptiveGroups`, `auditLogsGroups`, `autoRAGConfigAPIAdaptiveGroups`, `autoRAGEngineAdaptiveGroups`, `browserIsolationSessionsAdaptiveGroups`, `browserIsolationUserActionsAdaptiveGroups`, `browserRenderingApiAdaptive`, `browserRenderingApiAdaptiveGroups`, `browserRenderingBindingSessionsAdaptiveGroups`, `browserRenderingBrowserTimeUsageAdaptiveGroups`, `browserRenderingEventsAdaptive`, `browserRenderingEventsAdaptiveGroups`, `callsStatusAdaptive`, `callsTurnUsageAdaptiveGroups`, `callsUsageAdaptiveGroups`, `cdnNetworkAnalyticsAdaptiveGroups`, `cf1AccessLogins1dGroups`, `cf1AccessLogins1hGroups`, `cf1AccessLoginsRawGroups`, `cf1GatewayDns1dGroups`, `cf1GatewayDns1hGroups`, `cf1GatewayDnsRawGroups`, `cf1GatewayHttp1dGroups`, `cf1GatewayHttp1hGroups`, `cf1GatewayHttpRawGroups`, `cf1GatewayNetwork1dGroups`, `cf1GatewayNetwork1hGroups`, `cf1GatewayNetworkRawGroups`, `cf1GatewayNetworkSession1dGroups`, `cf1GatewayNetworkSession1hGroups`, `cf1GatewayNetworkSessionRawGroups`, `cf1McpHost1dGroups`, `cloudchamberMetricsAdaptiveGroups`, `cloudflareTunnelsAnalyticsAdaptiveGroups`, `cloudforceOneDetectionsAdaptiveGroups`, `cloudforceOneDetectionsStagingAdaptiveGroups`, `containersMetricsAdaptiveGroups`, `containersUsageAdaptiveGroups`, `d1AnalyticsAdaptiveGroups`, `d1QueriesAdaptiveGroups`, `d1StorageAdaptiveGroups`, `dnsAnalyticsAdaptive`, `dnsAnalyticsAdaptiveGroups`, `dnsFirewallAnalyticsAdaptive`, `dnsFirewallAnalyticsAdaptiveGroups`, `dosdAttackAnalyticsGroups`, `dosdNetworkAnalyticsAdaptiveGroups`, `durableObjectsInvocationsAdaptiveGroups`, `durableObjectsPeriodicGroups`, `durableObjectsSqlStorageGroups`, `durableObjectsStorageGroups`, `durableObjectsSubrequestsAdaptiveGroups`, `emailComplaintsAdaptiveGroups`, `emailSendingAdaptive`, `emailSendingAdaptiveGroups`, `fbmAttackAnalyticsGroups`, `firewallEventsAdaptive`, `firewallEventsAdaptiveGroups`, `flagshipFlagEvaluationsAdaptive`, `flagshipFlagEvaluationsAdaptiveGroups`, `flowtrackdNetworkAnalyticsAdaptiveGroups`, `gatewayL4DownstreamSessionsAdaptiveGroups`, `gatewayL4SessionsAdaptiveGroups`, `gatewayL4UpstreamSessionsAdaptiveGroups`, `gatewayL7RequestsAdaptiveGroups`, `gatewayResolverByCategoryAdaptiveGroups`, `gatewayResolverByCustomResolverGroups`, `gatewayResolverByRuleExecutionPerformanceAdaptiveGroups`, `gatewayResolverQueriesAdaptiveGroups`, `httpRequests1dGroups`, `httpRequests1hGroups`, `httpRequests1mGroups`, `httpRequestsAdaptive`, `httpRequestsAdaptiveGroups`, `httpRequestsOverviewAdaptiveGroups`, `hyperdrivePoolSizesAdaptiveGroups`, `hyperdriveQueriesAdaptiveGroups`, `imagesHostedRequestsAdaptiveGroups`, `imagesHostedRequestsStagingAdaptiveGroups`, `imagesRequestsAdaptiveGroups`, `imagesTransformationsAdaptiveGroups`, `imagesUniqueGroups`, `imagesUniqueTransformations`, `imagesUniqueTransformationsAccumulatedSinceStartOfMonth`, `k2ConsumeAdaptiveGroups`, `k2ConsumeStagingAdaptiveGroups`, `k2ProduceAdaptiveGroups`, `k2ProduceStagingAdaptiveGroups`, `k2StorageAdaptiveGroups`, `k2StorageStagingAdaptiveGroups`, `k2SubscriptionLagAdaptiveGroups`, `k2SubscriptionLagStagingAdaptiveGroups`, `kvOperationsAdaptiveGroups`, `kvStorageAdaptiveGroups`, `lbHealthEntitiesGroups`, `lbHealthEvents`, `liveInputEventsAdaptive`, `liveInputEventsAdaptiveGroups`, `logExplorerIngestionAdaptiveGroups`, `logpushHealthAdaptiveGroups`, `logpushTransformersAdaptiveGroups`, `logpushTransformersSuccessfulUsageAdaptiveGroups`, `logpushUsageAdaptiveGroups`, `magicEndpointHealthCheckAdaptiveGroups`, `magicFirewallNetworkAnalyticsAdaptiveGroups`, `magicFirewallRateLimitNetworkAnalyticsAdaptiveGroups`, `magicFirewallSamplesAdaptiveGroups`, `magicIDPSNetworkAnalyticsAdaptiveGroups`, `magicTransitFragNeededErrorsAdaptiveGroups`, `magicTransitNetworkAnalyticsAdaptiveGroups`, `magicTransitTunnelHealthCheckSLOsAdaptiveGroups`, `magicTransitTunnelHealthChecksAdaptiveGroups`, `magicTransitTunnelTrafficAdaptiveGroups`, `markdownForAgentsAdaptiveGroups`, `mconnTelemetryEventsAdaptiveGroups`, `mconnTelemetryEventsStagingAdaptiveGroups`, `mconnTelemetrySnapshotDhcpLeasesAdaptiveGroups`, `mconnTelemetrySnapshotDhcpLeasesStagingAdaptiveGroups`, `mconnTelemetrySnapshotDisksAdaptiveGroups`, `mconnTelemetrySnapshotDisksStagingAdaptiveGroups`, `mconnTelemetrySnapshotInterfaceAddressesAdaptiveGroups`, `mconnTelemetrySnapshotInterfaceAddressesStagingAdaptiveGroups`, `mconnTelemetrySnapshotInterfacesAdaptiveGroups`, `mconnTelemetrySnapshotInterfacesStagingAdaptiveGroups`, `mconnTelemetrySnapshotMountsAdaptiveGroups`, `mconnTelemetrySnapshotMountsStagingAdaptiveGroups`, `mconnTelemetrySnapshotNetdevsAdaptiveGroups`, `mconnTelemetrySnapshotNetdevsStagingAdaptiveGroups`, `mconnTelemetrySnapshotThermalsAdaptiveGroups`, `mconnTelemetrySnapshotThermalsStagingAdaptiveGroups`, `mconnTelemetrySnapshotTunnelsAdaptiveGroups`, `mconnTelemetrySnapshotTunnelsStagingAdaptiveGroups`, `mconnTelemetrySnapshotsAdaptiveGroups`, `mconnTelemetrySnapshotsStagingAdaptiveGroups`, `mediaUniqueTransformations`, `mediaUniqueTransformationsAccumulatedSinceStartOfMonth`, `mnmAWSVPCFlowDataAdaptiveGroups`, `mnmFlowDataAdaptiveGroups`, `monetizationGatewayAdaptiveGroups`, `nelReportsAdaptiveGroups`, `networkQualityUsageAdaptiveGroups`, `ohttpMetricsAdaptive`, `ohttpMetricsAdaptiveGroups`, `ohttpRelayEgressConnMetricsAdaptiveGroups`, `ohttpRelayIngressConnMetricsAdaptiveGroups`, `ohttpRelayRequestMetricsAdaptiveGroups`, `pageShieldReportsAdaptiveGroups`, `pagesFunctionsInvocationsAdaptiveGroups`, `pipelinesDeliveryAdaptiveGroups`, `pipelinesIngestionAdaptiveGroups`, `pipelinesOperatorAdaptiveGroups`, `pipelinesOperatorStagingAdaptiveGroups`, `pipelinesSinkAdaptiveGroups`, `pipelinesSinkStagingAdaptiveGroups`, `pipelinesUserErrorsAdaptive`, `pipelinesUserErrorsAdaptiveGroups`, `pipelinesUserErrorsStagingAdaptive`, `pipelinesUserErrorsStagingAdaptiveGroups`, `precursorEventsAdaptiveGroups`, `precursorSessionsAdaptiveGroups`, `privacyProxyAuthMetricsAdaptiveGroups`, `privacyProxyEgressConnMetricsAdaptiveGroups`, `privacyProxyIngressConnMetricsAdaptiveGroups`, `privacyProxyRequestMetricsAdaptiveGroups`, `programmableFlowProtectionNetworkAnalyticsAdaptiveGroups`, `queueBacklogAdaptiveGroups`, `queueConsumerMetricsAdaptiveGroups`, `queueDelayedBacklogAdaptiveGroups`, `queueMessageOperationsAdaptiveGroups`, `r2BandwidthUsageAdaptiveGroups`, `r2CatalogDataOperationsAdaptiveGroups`, `r2CatalogTableMaintenanceAdaptiveGroups`, `r2OperationsAdaptiveGroups`, `r2StorageAdaptiveGroups`, `r2sqlOperationsAdaptiveGroups`, `realtimeKitUsageAdaptiveGroups`, `rumPageloadEventsAdaptiveGroups`, `rumPerformanceEventsAdaptiveGroups`, `rumWebVitalsEventsAdaptive`, `rumWebVitalsEventsAdaptiveGroups`, `settings`, `shadowIt1hGroups`, `sinkholeRequestLogsAdaptive`, `sinkholeRequestLogsAdaptiveGroups`, `sippyOperationsAdaptiveGroups`, `spectrumNetworkAnalyticsAdaptiveGroups`, `storageTraces`, `streamCMCDAdaptiveGroups`, `streamMinutesViewedAdaptiveGroups`, `streamWHEPPlaybackMetricsAdaptiveGroups`, `streamWHIPBroadcastMetricsAdaptive`, `streamWHIPBroadcastMetricsAdaptiveGroups`, `toMarkdownConversionAdaptive`, `toMarkdownConversionAdaptiveGroups`, `turnstileAdaptiveGroups`, `vectorizeQueriesAdaptiveGroups`, `vectorizeStorageAdaptiveGroups`, `vectorizeV2OperationsAdaptiveGroups`, `vectorizeV2QueriesAdaptiveGroups`, `vectorizeV2StorageAdaptiveGroups`, `vectorizeV2WritesAdaptiveGroups`, `videoBufferEventsAdaptiveGroups`, `videoPlaybackEventsAdaptiveGroups`, `videoQualityEventsAdaptiveGroups`, `warpDeviceAdaptiveGroups`, `webSearchRequestsAdaptiveGroups`, `workerPlacementAdaptiveGroups`, `workersAnalyticsEngineAdaptiveGroups`, `workersAssetsRequestsAdaptiveGroups`, `workersBuildsBuildMinutesAdaptiveGroups`, `workersCacheRequestsAdaptiveGroups`, `workersInvocationsAdaptive`, `workersInvocationsByOwnerAndScriptGroups`, `workersInvocationsScheduled`, `workersOverviewDataAdaptiveGroups`, `workersOverviewRequestsAdaptiveGroups`, `workersSubrequestsAdaptiveGroups`, `workersVpcConnectionAdaptiveGroups`, `workflowsAdaptive`, `workflowsAdaptiveGroups`, `workflowsBlockedReasonAdaptiveGroups`, `workflowsQueueDepthAdaptiveGroups`, `workflowsQueueWaitAdaptiveGroups`, `zarazTrackAdaptiveGroups`, `zarazTriggersAdaptiveGroups`, `zeroTrustPrivateNetworkDiscoveryGroups`, `zones`

</details>
