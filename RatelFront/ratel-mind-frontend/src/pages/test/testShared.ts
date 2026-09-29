import {Pillar, Skill} from "../../types/Types.ts";

export const PILLAR_ORDER: Pillar[] = [Pillar.Cognitive, Pillar.Emotional, Pillar.Behavioral, Pillar.Social];

export const PILLAR_SKILLS_ORDER: Record<Pillar, Skill[]> = {
    [Pillar.Cognitive]: [Skill.Agency, Skill.CognitiveFlexibility, Skill.SituationAnalysis],
    [Pillar.Emotional]: [Skill.EmotionalRegulation, Skill.StressResilience, Skill.Recovery],
    [Pillar.Behavioral]: [Skill.DecisionMaking, Skill.Perseverance, Skill.GoalDirectedAction],
    [Pillar.Social]: [Skill.SupportNetwork, Skill.Assertiveness, Skill.ResilienceInRelationships],
};

const PILLAR_LABELS: Record<Pillar, string> = {
    [Pillar.Cognitive]: "Poznawczy",
    [Pillar.Emotional]: "Emocjonalny",
    [Pillar.Behavioral]: "Behawioralny",
    [Pillar.Social]: "Społeczny",
};

const SKILL_LABELS: Record<Skill, string> = {
    [Skill.Agency]: "Sprawczość",
    [Skill.CognitiveFlexibility]: "Elastyczność poznawcza",
    [Skill.SituationAnalysis]: "Analiza sytuacji",
    [Skill.EmotionalRegulation]: "Regulacja emocji",
    [Skill.StressResilience]: "Odporność na stres",
    [Skill.Recovery]: "Regeneracja",
    [Skill.DecisionMaking]: "Podejmowanie decyzji",
    [Skill.Perseverance]: "Wytrwałość",
    [Skill.GoalDirectedAction]: "Działanie ukierunkowane na cel",
    [Skill.SupportNetwork]: "Sieć wsparcia",
    [Skill.Assertiveness]: "Asertywność",
    [Skill.ResilienceInRelationships]: "Odporność w relacjach",
};

export const localizePillarName = (pillar: Pillar) => PILLAR_LABELS[pillar] ?? pillar;
export const localizeSkillName = (skill: Skill) => SKILL_LABELS[skill] ?? skill;
