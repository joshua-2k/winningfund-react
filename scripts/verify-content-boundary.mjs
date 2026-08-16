import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {
  siteContentBundle,
  siteContentValidation,
  selectHomePageData,
  selectAboutPageData,
  selectMembersPageData,
  selectActivitiesPageData,
  selectRecruitmentPageData,
  selectNavigation,
  RECRUITMENT_VIEW,
} from '../src/content/index.js'

const root = process.cwd()
let failed = false
const pass=(m)=>console.log(`PASS: ${m}`)
const fail=(m)=>{failed=true;console.error(`FAIL: ${m}`)}

for (const key of [
  'siteConfig','navigation','homeContent','aboutContent','organization',
  'externalActivities','socialLinks','membersByTerm','activitySections',
  'reportExamples','clubs','recruitment','assets',
]) {
  key in siteContentBundle ? pass(`SiteContentBundle root ${key}`) : fail(`missing root ${key}`)
}

siteContentValidation.ok
  ? pass('bundle validation has zero blocking errors')
  : siteContentValidation.errors.forEach(fail)

siteContentValidation.warnings.some((w)=>w.includes('Recruitment authoritative status unresolved'))
  ? pass('recruitment unresolved remains explicit warning')
  : fail('recruitment unresolved warning missing')

const nav=selectNavigation(siteContentBundle)
nav.map((x)=>x.path).join('|')==='/'+'|/about|/members|/activities|/recruitment'
  ? pass('navigation resolves canonical five routes')
  : fail('navigation route order mismatch')

const canonical=['sector-followup','classes','mock-investment-fm','reports']
const home=selectHomePageData(siteContentBundle)
home.programOverview.map((x)=>x?.activityId).join('|')===canonical.join('|')
  ? pass('HOME program projection joins canonical activity records')
  : fail('HOME duplicated/broke canonical activity references')

home.hero.englishIdentity==='INVESTMENT AND ECONOMICS CLUB' &&
home.hero.koreanSlogan==='우리는 늘 최선의 선택을 연구합니다'
  ? pass('approved HOME hero copy preserved')
  : fail('approved HOME hero copy changed')

const members=selectMembersPageData(siteContentBundle)
const current=members.terms.find((x)=>x.termId===members.currentTermId)
members.currentTermId==='18-2' && current?.members?.length===9
  ? pass('18-2 current term + 9 verified members preserved')
  : fail('18-2 current member baseline invalid')

const expectedTermIds = [
  '18-2','18-1','17-2','17-1','16-2','16-1','15-2','15-1',
  '14-2','14-1','13-2','13-1','12-2','12-1','11-2','11-1',
  '10-2','10-1','9-2','9-1','8-2','8-1','7-2','7-1',
  '6-2','6-1','5-2','5-1','4-2','4-1','3-2','3-1',
  '2-2','2-1','1-2','1-1',
]
members.terms.length===expectedTermIds.length &&
members.terms.every((x)=>x.dataStatus==='AVAILABLE' && x.members.length>0) &&
members.terms
  .slice()
  .sort((a,b)=>a.order-b.order)
  .map((x)=>x.termId)
  .join('|')===expectedTermIds.join('|')
  ? pass('complete 1-1 through 18-2 member history preserved')
  : fail('complete member history baseline invalid')

const activities=selectActivitiesPageData(siteContentBundle)
activities.activitySections.map((x)=>x.activityId).join('|')===canonical.join('|')
  ? pass('canonical activity IDs/order preserved')
  : fail('canonical activity IDs/order invalid')

for (const name of ['자하부공','위닝홀미팅','산그좋','위닝스런']) {
  activities.clubs.some((x)=>x.officialName===name)
    ? pass(`approved club ${name}`)
    : fail(`missing approved club ${name}`)
}

const recruitment=selectRecruitmentPageData(siteContentBundle)
recruitment.view===RECRUITMENT_VIEW.CONTENT_UNAVAILABLE
  ? pass('unresolved recruitment -> CONTENT_UNAVAILABLE')
  : fail(`unexpected recruitment view ${recruitment.view}`)

recruitment.record?.period?.startAt==='2026-08-03' &&
recruitment.record?.period?.endAt==='2026-08-21'
  ? pass('approved recruitment period preserved')
  : fail('approved recruitment period missing')

recruitment.record?.applicationUrl===null &&
recruitment.record?.contact===null &&
recruitment.record?.posterAssetId===null
  ? pass('recruitment URL/contact/poster remain unfabricated')
  : fail('recruitment unresolved values fabricated')

activities.reportExamples.every((x)=>x.assetId===null && x.unresolvedKey==='U-007')
  ? pass('U-007 report assets explicitly unresolved')
  : fail('U-007 report assets fabricated')

const fm=activities.activitySections.find((x)=>x.activityId==='mock-investment-fm')
fm?.semanticFacts?.tradingJournalAssetId===null &&
fm?.semanticFacts?.unresolvedKey==='U-006'
  ? pass('U-006 FM journal explicitly unresolved')
  : fail('U-006 FM journal silently filled')

const requiredAssetIds = [
  'brand-logo',
  'member-18-2-01-photo',
  'member-18-2-02-photo',
  'member-18-2-03-photo',
  'member-18-2-04-photo',
  'member-18-2-05-photo',
  'member-18-2-06-photo',
  'member-18-2-07-photo',
  'member-18-2-08-photo',
  'member-18-2-09-photo',
  'activity-sector-followup-photo',
  'activity-fm-monthly-report-photo',
  'activity-team-report-presentation-photo',
  'activity-individual-strategy-report-photo',
  'activity-individual-company-report-photo',
  'activity-stock-game-photo',
  'activity-stock-mentoring-photo',
  'activity-club-jahabugong-poster',
  'activity-club-winning-hall-meeting-poster',
  'activity-club-winnings-run-poster',
  'activity-club-sangeujoah-poster',
]

const assetIds = new Set(
  siteContentBundle.assets.map((asset) => asset.assetId),
)

siteContentBundle.assets.length===requiredAssetIds.length &&
requiredAssetIds.every((assetId)=>assetIds.has(assetId)) &&
siteContentBundle.assets.every((asset)=>
  asset.assetId &&
  asset.sourcePath &&
  asset.src &&
  !String(asset.sourcePath).startsWith('data:') &&
  !String(asset.src).startsWith('data:') &&
  fs.existsSync(path.join(root,asset.sourcePath))
)
  ? pass('21 managed asset refs: 1 brand + 9 members + 11 activities')
  : fail('asset registry invalid')

const pageDir=path.join(root,'src','pages')
for (const entry of fs.readdirSync(pageDir,{withFileTypes:true}).filter((x)=>x.isFile()&&/Page\.js$/.test(x.name))) {
  const text=fs.readFileSync(path.join(pageDir,entry.name),'utf8');
  /content\/static|staticSiteSource|assetRegistry/.test(text)
    ? fail(`${entry.name} imports physical source directly`)
    : pass(`${entry.name} does not know physical source`)
}

for (const fn of [
  selectHomePageData,selectAboutPageData,selectMembersPageData,
  selectActivitiesPageData,selectRecruitmentPageData,
]) {
  typeof fn==='function' ? pass(`page selector exported: ${fn.name}`) : fail('page selector missing')
}

if (failed) {
  console.error('\nSTEP 03 content boundary verification FAILED.')
  process.exit(1)
}
console.log('\nSTEP 03 content boundary verification PASSED.')
