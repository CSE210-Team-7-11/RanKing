# Reading the diagrams

These examples show how to read the shapes, arrows, and labels used in the documentation.

## Flowcharts

Follow the arrows. Boxes represent actions or components; diamonds mark decisions. Arrow labels identify the branch to follow.

```mermaid
flowchart LR
    Open["Open game"] --> Online{"Online?"}
    Online -->|Yes| Check["Check version"]
    Online -->|No| Offline{"Offline play<br/>ready?"}
    Offline -->|Yes| Play["Play offline"]
    Offline -->|No| Unavailable["Can't play<br/>offline"]
```

Cylinders represent storage. Enclosing boxes group components. A two-way arrow indicates an exchange in both directions.

```mermaid
flowchart LR
    subgraph Browser["Browser"]
        Host["Game host"]
        Game["Game iframe"]
        Host <-->|Game interface| Game
    end
    Host <-->|Ranked requests<br/>and responses| API["Ranking API"]
    API <-->|Read and write| Store[("Ranking store")]
```

Dashed connections take their meaning from their labels or the accompanying text.

## Sequence diagrams

Read downward through the messages between participants. Solid arrows send messages; dashed arrows return responses in these diagrams. A self-directed arrow shows internal work.

```mermaid
sequenceDiagram
    participant Host as Game host
    participant Game as Game
    Host->>Game: Request practice suggestion
    Game->>Game: Examine prior attempts
    Game-->>Host: Suggested exercise and reason
```

**alt** selects between alternatives; **else** marks another branch. **opt** runs its enclosed steps only when its condition holds. Nested frames apply within the surrounding branch.

```mermaid
sequenceDiagram
    actor Player
    participant Host as Game host
    participant Game as Game
    Host->>Game: Request practice suggestion
    alt Game has a suggestion
        Game-->>Host: Exercise and reason
        Host-->>Player: Offer exercise
        opt Player chooses exercise
            Player->>Host: Start exercise
            Host->>Game: Launch scoped practice
        end
    else Game has no suggestion
        Game-->>Host: No suggestion
        Host-->>Player: Offer ordinary practice
    end
```

Here, "optional" describes whether the player takes that path, not whether the behavior needs implementing.

## Entity relationships

Boxes represent record types. Read each connection in both directions. End markers give the count: `||` means exactly one, `o|` means zero or one, and `o{` means zero or more.

```mermaid
erDiagram
    PLAYER ||--o{ RANKED_RUN : owns
    RANKED_RUN ||--o| ACCEPTED_RESULT : yields
```

A player can own many runs or none. Each run belongs to one player and can yield at most one accepted result. Each accepted result belongs to exactly one run.

## Nested layer diagrams

Enclosing outlines show containment. Each outer layer includes the contents of the layers inside it, together with anything added at its own level.

```mermaid
flowchart TB
    subgraph Outer["Outer layer"]
        C["Addition C"]
        subgraph Middle["Middle layer"]
            B["Addition B"]
            subgraph Inner["Inner layer"]
                A["Base A"]
            end
        end
    end
```

The middle layer includes A and B. The outer layer includes A, B, and C. Nesting shows inclusion, not a sequence of steps.
