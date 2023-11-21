# Export Server API

All endpoints are rate-limited.

Currently defined endpoints:

| Method | Path                | Purpose |
|--------|---------------------|---------|
| GET | /api/v1/listen/[token] | A long-running connection for ASB to listen for events |
| PUT | /api/v1/export/[token] | Used by the mod to send export files |
| PUT | /api/v1/server/[token]/[hash] | Used by the mod to send server config files |

## Send Export file
```
PUT /api/v1/export/[token]
```
Allows the client mod to send an export file. The token must have previously been given to the user by the receiver (usually ASB).

The request must include the following headers:
| Header | Value |
|-|-|
| `content-type` | `application/json` |
| `content-length` | Must be valid (strict size-limits apply) |

The following status codes can results:

| Status | Name | Meaning |
|-|-|-|
| `200` | OK | Export file is accepted |
| `400` | Bad Request | Invalid token, headers or data |
| `424` | Failed Dependency | No listener is connected with this token currently |
| `429` | Too Many Requests | Rate limiting has denied this request |
| `500+` | Server Error | Something went wrong with the server or its proxy |

## Send Server config file
```
PUT /api/v1/server/[token]/[hash]
```
Allows the client mod to send a server configutation file. The token must have previously been given to the user by the receiver (usually ASB), and the hash is the same one included in the creature export file.

The request must include the following headers:
| Header | Value |
|-|-|
| `content-type` | `application/json` |
| `content-length` | Must be valid (strict size-limits apply) |

The following status codes can results:

| Status | Name | Meaning |
|-|-|-|
| `200` | OK | Export file is accepted |
| `400` | Bad Request | Invalid token, headers or data |
| `424` | Failed Dependency | No listener is connected with this token currently |
| `429` | Too Many Requests | Rate limiting has denied this request |
| `500+` | Server Error | Something went wrong with the server or its proxy |


## Listening
```
GET /api/v1/listen/[token]
```

Allows the receiver (usually ASB) to connect and receive events from the mod as they happen. It is intended that ASB generates the token and shows it to the user so they can enter it into the mod. It should be saved associated with the ASB instance, not per library (to avoid clashes when sharing a library).

This endpoint uses SSE ([Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)) to keep the channel open and stream events to the caller as they happen.

The receiver should automatically reconnect to this endpoint to ensure continued service. The exception to this rule is when the `replaced` event is received, which indicates another receiver has taken over for this token.

Each message is sent as one or more lines of the form `<name>: <value>` with a full blank line is used to denote the end of this message (i.e. `\n\n`). We use the form `event: <event name>` as the first line to inform the message type.

Possible event types:
| Form            | Meaning |
|-----------------|---------|
| `welcome`       | This connection is now active |
| `ping`          | Sent regularly to maintain the connection - can be ignored |
| `replaced`      | Another listener connected with this token |
| `export`        | A creature export file immediately follows as `data: <JSON encoded file>` |
| `server <hash>` | A server config file immediately follows as `data: <JSON encoded file>` |
| `closing`       | This connection is closing but reconnection is allowed (e.g. on a server restart) |

Where data is expected (for `export` and `server` events) it will be supplied on the next line encoded as JSON and includes as `data: <JSON encoded data>`.

Example stream:
```
event: welcome

event: ping

event: export
data: {"Format":1,"DinoName":"Generated","TribeName":"QuackTribe","SpeciesName":"Iguanodon","TamerString":"Quackers","OwningPlayerName":"","ImprinterName":"","OwningPlayerID":0,"DinoID1":"307252455","DinoID2":"304387993","BlueprintPath":"/Game/PrimalEarth/Dinos/Iguanodon/Iguanodon_Character_BP.Iguanodon_Character_BP_C","Stats":[{"Wild":1,"Tamed":0,"Mutated":0,"Value":300.07000732421875},{"Wild":1,"Tamed":0,"Mutated":0,"Value":220},{"Wild":7,"Tamed":0,"Mutated":0,"Value":298.70001220703125},{"Wild":1,"Tamed":0,"Mutated":0,"Value":165},{"Wild":1,"Tamed":0,"Mutated":0,"Value":1980},{"Wild":0,"Tamed":0,"Mutated":0,"Value":100},{"Wild":0,"Tamed":0,"Mutated":0,"Value":0},{"Wild":1,"Tamed":0,"Mutated":0,"Value":382.5},{"Wild":1,"Tamed":0,"Mutated":0,"Value":0.3171199560165405},{"Wild":1,"Tamed":0,"Mutated":0,"Value":0},{"Wild":0,"Tamed":0,"Mutated":0,"Value":0},{"Wild":0,"Tamed":0,"Mutated":0,"Value":0}],"ColorSetIndices":[82,0,0,0,26,30],"ColorSetValues":{"0":[0.0262410007417202,0.014444000087678432,0.027320999652147293,0],"1":[1,1,1,1],"2":[1,1,1,1],"3":[1,1,1,1],"4":[0.19499999284744263,0.30000001192092896,0.19499999284744263,0],"5":[0.7799999713897705,0.699999988079071,1,0]},"IsFemale":true,"NextAllowedMatingTimeDuration":0,"BabyAge":1,"MutagenApplied":false,"Neutered":false,"RandomMutationsMale":0,"RandomMutationsFemale":0,"ServerMultipliersHash":"-895343795","TameEffectiveness":1,"BaseCharacterLevel":8,"DinoImprintingQuality":0}

event: server 1234567
data: {"Version":2,"WildLevel":[1,1,1,1,1,1,1,1,1,1,1,1],"TameLevel":[0.20000000298023224,1,1,1,1,1,1,1,0.17000000178813934,1,1,1],"TameAdd":[0.14000000059604645,1,1,1,1,1,1,1,0.14000000059604645,1,1,1],"TameAff":[0.4399999976158142,1,1,1,1,1,1,1,0.4399999976158142,1,1,1],"WildLevelStepSize":4,"MaxWildLevel":120,"DestroyTamesOverLevelClamp":0,"TamingSpeedMultiplier":1,"DinoCharacterFoodDrainMultiplier":1,"MatingSpeedMultiplier":1,"MatingIntervalMultiplier":0.10000000149011612,"EggHatchSpeedMultiplier":10,"BabyMatureSpeedMultiplier":10,"BabyCuddleIntervalMultiplier":0.10000000149011612,"BabyImprintAmountMultiplier":1,"BabyImprintingStatScaleMultiplier":1,"BabyFoodConsumptionSpeedMultiplier":1,"TamedDinoCharacterFoodDrainMultiplier":1,"WildDinoTorporDrainMultiplier":1,"WildDinoCharacterFoodDrainMultiplier":1,"AllowSpeedLeveling":false,"AllowFlyerSpeedLeveling":false,"UseSingleplayerSettings":false,"SessionName":"The Carnotaurus Trials - (v26.38)"}

event: ping

event: ping

event: replaced
```