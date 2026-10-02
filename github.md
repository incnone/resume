repo: incnone/necrobot
branch: master

Two of Jordan Watkins's public repos were read to source CV content. The site
itself will live in a separate repo the user creates (incnone.github.io/resume
or /professional).

## Last sync
date: 2026-09-24T08:48:49Z

### Updated in this project (2026-09-24)
- Confirmed in condor_ratings (elorate.py, predict.py) that the link function mixes erf and x/(1+|x|) with a tail weight of alpha = 0.42, fit to past data (per Jordan). Added to the CV.
- Made the C++ bayeselo covariance patch (incnone/condor) an explicit bullet in both the long and short rating entries.

## Previous sync
date: 2026-09-17T23:52:00Z

### Updated in this project
- Surveyed all 11 public repos under github.com/incnone and folded the notable work into the CV.
- Rating work reframed as a multi-season arc across three repos (condor → s6_elostuff → condor_ratings), not one project.
- Confirmed genuine model selection: prior variance chosen by maximizing log-likelihood on held-out matches from a prior season (s6_elostuff/elorate.py test_stdev, get_ll_for_stdev).
- Found C++ work: incnone/condor patches Rémi Coulom's Bayesian Elo engine to expose its covariance matrix, used for binormal series-outcome prediction with correlated ratings.
- Necrobot upgraded from "a Discord bot" to its real architecture: two production bots from one layered codebase, ~150 modules / 16 packages, documented acyclic dependencies, internal command framework, table-mapped object layer, async Python + Google Sheets + timezone handling.
- Corrected rating attribution: Necrobot uses the TrueSkill library; the custom modeling lives in condor_ratings / s6_elostuff.

## Related repos
- incnone/condor_ratings @ master — elorate.py (model + optimizer), predict.py (win/series probabilities), automatch.py (PuLP/CBC ILP + cycle local search).
- incnone/s6_elostuff @ master — earlier season's rater/automatcher; held-out log-likelihood hyperparameter selection, Bradley–Terry (gamma) parameterization.
- incnone/condor @ master — C++ (CEloRatingCUI.cpp) patch to bayeselo exposing the covariance matrix; elo2.py binormal 3-game series prediction.
- Not used: condorbot and condor-fdd-bot (superseded by necrobot); alttprandohelper (a JavaScript fork whose contribution scope I could not verify).

## Screen map
| Screen | Built from |
| --- | --- |
| index.html — Projects: CoNDOR Ratings | incnone/condor_ratings: elorate.py, predict.py, automatch.py |
| index.html — Projects: Necrobot | incnone/necrobot: README, requirements.txt |
| cv/ml.html — Modeling & quantitative work | incnone/condor_ratings, incnone/s6_elostuff, incnone/condor |
| index.html — Projects: Necrobot architecture | incnone/necrobot: docs/Code.md, requirements.txt, package tree |
| cv/phd.html — Software & quantitative projects | incnone/condor_ratings, incnone/necrobot |
| cv/*.html — Necrobot entries | incnone/necrobot: README, requirements.txt |
| _data/cv.json — blocks ratings.full / ratings.short / necrobot | both repos |
