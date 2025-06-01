# Export Format (Server Configuration)

This is the Export format used for the [ASB Export Gun](https://www.curseforge.com/ark-survival-ascended/mods/ark-smart-breeding-export-gun) mod to export Server Configuration to [ASB](https://github.com/cadon/ARKStatsExtractor), in order to circumvent the horribleness that is the default ARK Dino Export.

This feature can be explicitly disabled if the server owner does not want to share these Server configuration fields, though no sensitive Data is included.

These Files are only stored on your own PC, or if you use The Remote Export Feature, on whatever PC is running ASB.

## Filenames
The File gets named after an Hash of its contents, made possible thanks to Kozenomenon's [Kozhash](https://github.com/Kozenomenon/KozHash) Library.
Note: The Hash may be negative!
Any [Exported Dino](Export%20Format%20%28Server%20Configuration%29.md) will have a `ServerMultipliersHash` Field that points to a given Server configuration, Stored in `ShooterGame\Saved\DinoExports\ASB\Servers` as a `.json` file.
E.g. if you have an Argentavis with a `ServerMultipliersHash` of `1004109957`, the Server Configuration can be found under
`1004109957.json`

## File Format
This is the File Format currently in Use.

```jsonc
{
	"Game": "ASA", // <string> Game for which these Config Fields are for.
	"Version": 2, // <int32> File Format Version.
	"WildLevel": [ 4, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1 ], // <float[12]> Stats Gained per Wild/Mutated Level, Listed in order. See Dino Export Format (DinoStat) for order.
	"TameLevel": [ 0.20000000298023224, 1, 41, 1, 1, 1, 1, 1, 0.17000000178813934, 1, 1, 1 ], // <float[12]> Stats Gained per Tamed Level Point.
	"TameAdd": [ 0.14000000059604645, 69, 1, 1, 1, 1, 1, 1, 0.14000000059604645, 1, 1, 1 ], // <float[12]> Stats Gained Upon Taming.
	"TameAff": [ 0.43999999761581421, 1, 420, 1, 1, 1, 1, 1, 0.43999999761581421, 1, 1, 1 ], // <float[12]> Stats Gained Upon Taming, affected by Taming Effectiveness.
	"WildLevelStepSize": 1, // <float> Interval between Levels.
	"MaxWildLevel": 30, // <float> Maximum (Normal) Wild Level seen in the Wild (Wyverns, Tek Dinos, and some others exceed this value).
	"DestroyTamesOverLevelClamp": 0, // <int> Amount of Dinos allowed in a single Tribe.
	"TamingSpeedMultiplier": 1, // <float> Taming Speed Multiplier.
	"DinoCharacterFoodDrainMultiplier": 1, // <float> How fast **Every** Dino loses Food.
	"MatingSpeedMultiplier": 3, // <float> Mating Speed Multiplier.
	"MatingIntervalMultiplier": 4, // <float> Confusing name, a value of 2.0 **Decreases** the Time between Mating by 50%.
	"EggHatchSpeedMultiplier": 400, // <float> How fast an Egg hatches.
	"BabyMatureSpeedMultiplier": 421, // <float> How fast a Baby Matures
	"BabyCuddleIntervalMultiplier": 0.0013746039476245642, // <float> Positive Values increase Time between Imprints.
	"BabyImprintAmountMultiplier": 3, // <float> Multiplies how much % Imprint you get per Interaction. 
	"BabyImprintingStatScaleMultiplier": 1, // <float> Imprint Stat Multiplier
	"BabyFoodConsumptionSpeedMultiplier": 1, // <float> How fast Babies Consume Food,
	"TamedDinoCharacterFoodDrainMultiplier": 1, // <float> How fast **Tamed** Dinos loses Food.
	"WildDinoTorporDrainMultiplier": 1, // <float> How fast Wild Dinos lose Torpor.
	"WildDinoCharacterFoodDrainMultiplier": 1, // <float> How fast Wild Dinos lose Food.
	"AllowSpeedLeveling": true, // <bool> Allow Leveling speed?
	"AllowFlyerSpeedLeveling": true, // <bool> Allow Leveling Flyer Speed?
	"UseSingleplayerSettings": false, // <bool> Are we using Singleplayer Multipliers?
	"SessionName": "ARK #848873 - (v456.1)" // <string> Session Name of the server (So that The hash of this file differs even with Identical Settings. )
}```