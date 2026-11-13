import {describe,expect,it} from 'vitest';
import {partnerHub,radarRows,recommendProjectTeam,teamMatch,venueFit,visualBriefSeed} from '@/data/growth';
import {creditsFor,profiles,projects} from '@/data/seed';

describe('growth capability rules',()=>{
 it('keeps every partner hub relation valid',()=>{expect(profiles.some(item=>item.id===partnerHub.ownerProfileId)).toBe(true);for(const id of partnerHub.memberProfileIds)expect(profiles.some(item=>item.id===id)).toBe(true);for(const id of partnerHub.projectIds)expect(projects.some(item=>item.id===id)).toBe(true)});
 it('produces explainable bounded team scores',()=>{const result=teamMatch(profiles[18],profiles.slice(0,5));expect(result.score).toBeGreaterThanOrEqual(0);expect(result.score).toBeLessThanOrEqual(100);expect(result.reasons.length).toBeGreaterThanOrEqual(3)});
 it('recommends only uncredited local or travel ready profiles that match the project style',()=>{const project=projects.find(item=>item.id==='white-garden-wedding')!;const credited=creditsFor(project.id);const recommendations=recommendProjectTeam(project,credited,profiles);expect(recommendations.length).toBeGreaterThan(0);for(const {profile,reason} of recommendations){expect(credited.some(credit=>credit.profileId===profile.id)).toBe(false);expect(profile.city===project.city||['countrywide','international'].includes(profile.travel)).toBe(true);expect(profile.styles.some(style=>project.styles.some(value=>value.toLocaleLowerCase('ru')===style.toLocaleLowerCase('ru')))).toBe(true);expect(reason).toContain('Стиль:')}});
 it('produces venue warnings and deterministic radar slices',()=>{const venue=profiles.find(item=>item.type==='venue')!;expect(venueFit(venue).warnings.length).toBeGreaterThan(0);expect(radarRows('moscow','month')).toEqual(radarRows('moscow','month'));expect(radarRows('moscow','month')).not.toEqual(radarRows('kazan','year'))});
 it('keeps the visual brief populated',()=>{expect(visualBriefSeed.roleHints.length).toBeGreaterThanOrEqual(6);expect(visualBriefSeed.reasons.length).toBeGreaterThanOrEqual(3)});
});
