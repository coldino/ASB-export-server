# Export Format (Dino)

This is the Export format used for the [ASB Export Gun](https://www.curseforge.com/ark-survival-ascended/mods/ark-smart-breeding-export-gun) mod to export Dinos to [ASB](https://github.com/cadon/ARKStatsExtractor), in order to circumvent the horribleness that is the default ARK Dino Export.

These Files are only stored on your own PC, or if you use The Remote Export Feature, on whatever PC is running ASB.

## Filenames
All Files are Stored in `ShooterGame\Saved\DinoExports\ASB` as `.json` files with the following Filename:
`<Species Name>_<DinoID1>-<DinoID2>.json`

Example: An `Argentavis` with a `DinoID1` of `2912915` and `DinoID2` of `768754123` would be saved under:
`Argentavis_2912915-768754123.json`


## File Format
This is the File Format currently in Use. Fields marked with a `?` may be completely absent if they are Empty (Ancestry)

```jsonc
{
	"Version": 1, // <int32> File Format Version.
	"DinoName": "Steve", // <string> Name of the Dino (Empty if Dino has not been named!).
	"TribeName": "Tribe of Survivor", // <string> Name of the Tribe this Dino Belongs to.
	"SpeciesName": "Ankylosaurus", // <string> Name of the Species of the Dino (Used as Display Name if DinoName is empty).
	"TamerString": "Survivor", // <string> Name of the Tamer of this Dino.
	"OwningPlayerName": "Survivor", // <string> Name of the Owner of this Dino.
	"ImprinterName": "", // <string> Name of the Imprinter (Empty if none).
	"OwningPlayerID": 35668347, // <int32> ID of the Owning Player.
	"DinoID1": "298340885", // <string> Higher 32 bits of Dino ID. (Containt uint32)
	"DinoID2": "280707659", // <string> Lower 32 bits of Dino ID.
	"Ancestry": // <Ancestry?> Direct Ancestors of the Dino.
	{
		"MaleName": "Steven", // <string> Name of the Father.
		"MaleDinoId1": "372256506", // <string> Higher 32 bits of Father's ID. (Containt uint32)
		"MaleDinoId2": "382551672", // <string> Lower 32 bits of Father's ID. (Containt uint32)
		"FemaleName": "John", // Name of the Mother.
		"FemaleDinoId1": "15471730", // <string> Higher 32 bits of Mother's ID. (Containt uint32)
		"FemaleDinoId2": "325509834" // <string> Lower 32 bits of Mother's ID. (Containt uint32)
	},
	"BlueprintPath": "/Game/PrimalEarth/Dinos/Ankylo/Ankylo_Character_BP.Ankylo_Character_BP_C", // <string> Dino's Blueprint Path
	"Stats": // <DinoStat[12]> All stats of the Dino, Listed in order
	[
		// Health
		{
			"Wild": 10, // <int32> Wild Levels.
			"Tamed": 0, // <int32> Tamed Levels.
			"Mutated": 0, // <int32> Mutated Levels.
			"Value": 6300.06982421875 // <float> Maximum Value.
		},
		// Stamina
		{
			"Wild": 10,
			"Tamed": 0,
			"Mutated": 0,
			"Value": 350
		},
		// Torpidity
		{
			"Wild": 184,
			"Tamed": 0,
			"Mutated": 0,
			"Value": 5057.2998046875
		},
		// Oxygen
		{
			"Wild": 9,
			"Tamed": 0,
			"Mutated": 0,
			"Value": 420
		},
		// Food
		{
			"Wild": 4,
			"Tamed": 0,
			"Mutated": 0,
			"Value": 4830
		},
		// Water
		{
			"Wild": 0,
			"Tamed": 0,
			"Mutated": 0,
			"Value": 100
		},
		// Temperature
		{
			"Wild": 0,
			"Tamed": 0,
			"Mutated": 0,
			"Value": 0
		},
		// Weight
		{
			"Wild": 7,
			"Tamed": 0,
			"Mutated": 0,
			"Value": 285
		},
		// Melee Damage Multiplier
		{
			"Wild": 10,
			"Tamed": 0,
			"Mutated": 0,
			"Value": 0.92864000797271729
		},
		// Speed Multiplier
		{
			"Wild": 134,
			"Tamed": 0,
			"Mutated": 0,
			"Value": 0.34999999403953552
		},
		// Fortitude
		{
			"Wild": 0,
			"Tamed": 0,
			"Mutated": 0,
			"Value": 0
		},
		// Crafting Speed Multiplier
		{
			"Wild": 0,
			"Tamed": 0,
			"Mutated": 0,
			"Value": 0
		}
	],
	"ColorSetIndices": [ 23, 34, 56, 32, 28, 71 ], // <int[6]> Color IDs for the regions [0-5].
	"ColorSetValues": // <ColorSet[5]> Color values for the Regions [0-5].
	{
		// <index> : [ <float> R, <float> G, <float> B, <float> A ]
		"0": [ 0.60000002384185791, 0.60000002384185791, 0.36000001430511475, 0 ],
		"1": [ 0.10000000149011612, 0.075000002980232239, 0.05000000074505806, 0 ],
		"2": [ 0.079999998211860657, 0.079999998211860657, 0.079999998211860657, 0 ],
		"3": [ 1, 0.75, 0.5, 0 ],
		"4": [ 0.69999998807907104, 0.74999898672103882, 1, 0 ],
		"5": [ 0.21223099529743195, 0.0295570008456707, 0.0091340001672506332, 0 ]
	},
	"IsFemale": false, // <bool> Is this Dino female?
	"NextAllowedMatingTimeDuration": 0, // <float> Time in seconds until next mating time for this Dino.
	"BabyAge": 0.5745089054107666, // <float> Age of the Dino, 0.0 is newborn, 1.0 is Adult.
	"MutagenApplied": false, // <bool> Has this Dino consumed Mutagen?
	"Neutered": true, // <bool> Is this Dino Neutered?
	"RandomMutationsMale": 0, // <int32> Amount of Paternal Mutations.
	"RandomMutationsFemale": 0, // <int32> Amount of Maternal Mutations.
	"ServerMultipliersHash": "1004109957", 	// <string> Hash of Server Multipliers for this Server. Used to find out if we need to request Server Stats or not. (Contains int32)
	"TameEffectiveness": 1, // <float> Taming effectiveness [0-1].
	"BaseCharacterLevel": 185, // <int32> Wild Levels
	"DinoImprintingQuality": 0, // <float> Dino Imprint Quality [0-1].
	"Traits": 	// <string[]> Traits Present on this Dino
	[
		// "<Id><[Tier]>" Tier is Zero-Indexed, making this a Dino with 3 levels of Melee Robust.
		"InheritMeleeRobust[2]"
	]
}
```