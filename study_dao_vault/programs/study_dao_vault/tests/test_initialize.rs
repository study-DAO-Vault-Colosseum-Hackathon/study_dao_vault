use study_dao_vault::{
    instructions::apply_reputation_action::derive_badge, BadgeTier, TIER_2_MIN, TIER_3_MIN,
    TIER_4_MIN, TIER_5_MIN,
};

#[test]
fn badge_thresholds_match_spec() {
    assert_eq!(derive_badge(0, false), BadgeTier::Spark);
    assert_eq!(derive_badge(TIER_2_MIN, false), BadgeTier::Current);
    assert_eq!(derive_badge(TIER_3_MIN, false), BadgeTier::Core);
    assert_eq!(derive_badge(TIER_4_MIN, false), BadgeTier::Supernova);
    assert_eq!(derive_badge(TIER_5_MIN, false), BadgeTier::Supernova);
    assert_eq!(derive_badge(TIER_5_MIN, true), BadgeTier::Singularity);
}
