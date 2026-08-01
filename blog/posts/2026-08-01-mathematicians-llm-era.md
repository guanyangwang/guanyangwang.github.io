---
title: "Dawn or Twilight? Mathematicians in the LLM Era"
date: 2026-08-01
author: Guanyang Wang
lang: en
description: "What AI's mathematical breakthroughs may mean for mathematicians, and why the future depends on automation, connection, and adaptation."
slug: mathematicians-llm-era
toc_title: Contents
toc-depth: 2
back_label: "← Back to Blog"
---

The [Fields Medals](https://www.mathunion.org/imu-awards/fields-medal/fields-medals-2026) and AI have brought mathematics into high summer in 2026. Yet with one AI breakthrough after another, being a mathematician seems to mean a little less than it once did.

I have seen more and more discussion about mathematicians and AI. People hold different views, but anxiety and pessimism seem to be the common ground. This post is an attempt to discuss where mathematicians might fit in the AI era. Note that I am not discussing mathematics itself: I think AI is a *net positive* for mathematics. I am discussing only the people.

## The Meta-Question

I think the most important question is this:

> When AI significantly accelerates the development of a field, do you expect that field to flourish or to wither?

For a concrete example, AI is currently producing far more breakthroughs in combinatorics than in analysis. If we paused AI development at this moment, which field would more people choose to enter: combinatorics or analysis?

Once you think about it, the answer is not obvious. There is a reasonable argument in either direction. That is because the answer actually depends on many additional factors. The two main ones I can think of are:

<div class="question-grid" role="list" aria-label="Two questions that shape the possible outcomes">
<section class="question-card" role="listitem" aria-labelledby="question-one-card">
<p class="question-label">Question 1</p>
<h3 id="question-one-card">How complete is AI's automation?</h3>
<p>Can it run the proof → verification → exploration loop entirely on its own, or does it still need human help at some stages?</p>
</section>
<section class="question-card" role="listitem" aria-labelledby="question-two-card">
<p class="question-label">Question 2</p>
<h3 id="question-two-card">Is the field relatively isolated?</h3>
<p>Or is it closely connected to other fields, so that progress can spill over into them?</p>
</section>
</div>

Returning to mathematics, answering yes or no to these two questions gives four combinations, each corresponding to a different possible ending.

## The First Question

The first question is really asking whether AI will become a tool or swallow its user.

### If AI Closes the Loop

If the answer to Question 1 is yes, suppose future AI can complete a fully automated loop from beginning to end. By this, I mean abstractions of every mathematical activity humans perform today: solving problems, proposing theories, writing papers, and iterating on all of them. In that case, I think humans will go from creators of mathematics to consumers. Whether or not we accept it, the word *mathematician* may pass into history. I imagine there will still be teachers who teach and communicate mathematics, but humans will withdraw from the intellectual work of creating it. In their place will be a fully industrialized and automated mode of operation. This may very well not be bad for humanity, but today's mathematicians would undoubtedly have to absorb an enormous sense of displacement.

### If the Loop Stays Open

If the answer to Question 1 is no, then people still have many opportunities. So far, the main strengths LLMs have shown are a superhuman ability to move across fields, search for counterexamples, and make clever use of existing results. What they have not yet shown is the ability to build new theories or complete proofs requiring extremely long chains of reasoning. This resembles the distinction I mentioned on [X](https://x.com/GuanyangW) between the style of Erdős and the style of Grothendieck.

There will be many ways for people to collaborate with AI. Theory builders can use it to explore, prove the basic theorems their theories require, and investigate possible applications in order to refine or revise a framework. Experts who want to attack major problems can try to break a problem into a roadmap, then ask AI to execute the intermediate steps. Mathematicians interested in LLMs themselves can design better harnesses or posttraining methods, or try to place formal languages such as [Lean](https://lean-lang.org/) inside the proof → verification → exploration loop.

People often compare mathematics with Go. Go is closer to a [PvP game](https://en.wikipedia.org/wiki/Player_versus_player), in which strength relative to the other player means everything. Mathematics is closer to a cooperative [PvE game](https://en.wikipedia.org/wiki/Player_versus_environment). People often look at the situation statically and assume that if AI can solve a major conjecture, then humans must have become useless. But in a cooperative game, a stronger tool can expand what the players are able to attempt. As long as the loop in Question 1 remains open, there remains a chance that humans can use AI as a collaborator to create mathematics of a kind and scale we have never seen before.

### A Note on Prompting Open Problems

I must emphasize that, in either scenario, I am deeply pessimistic about making a career out of prompting conjectures in one shot, even though it may be the most obvious path. The success rate is extremely uncertain, and the competition is brutal. At the same time, the importance of a result obtained by prompting will certainly depreciate quickly. For example, today [OpenAI released ten advances in mathematics and theoretical computer science](https://openai.com/index/ten-advances-in-mathematics/). Just ask yourself:

Given the current pace of development, do you really think a problem you prompted today can spend two years in peer review and appear in the [*Annals of Mathematics*](https://annals.math.princeton.edu/) in 2028?

There are other reasons. Prompting for purely instrumental reasons is not much fun. Based on my previous experiences ([1](./llm-ktv-lean.html), [2](./feige-conjecture.html)), I feel that for a result I prompt myself, I receive some “social/communication credit,” but little “intellectual credit” for the model-generated argument. If you choose to prompt an open problem, I suggest having at least one reason beyond publishing a paper: perhaps you are genuinely curious about the answer, or perhaps you have never tried it and simply want to play. You should also be prepared for the result to lose value even if it is correct, and for receiving little intellectual credit.

Prompting can still be interesting, useful, and a good way to learn. I just do not think it is wise to rely on it as a way to advance one's career.

## The Second Question

The second question has more to do with the nature of mathematics today.

### If Mathematics Is Isolated

If the answer to Question 2 is yes, meaning that mathematics is largely isolated, then progress in AI is more likely to make the profession wither. If mathematics mainly speaks to itself, more output mostly means more mathematics for the same audience. It does not automatically create more need for mathematicians. The subject may flourish as a body of knowledge while the human profession around it contracts.

### If Mathematical Progress Spills Over into Other Fields

If the answer to Question 2 is no, people may need more mathematicians. At the very least, mathematicians may branch out into bridges between mathematics and other fields. We see that a model's mathematical ability is often strongly correlated with its reasoning and coding abilities. History also gives us reason to believe that mathematics has decisive power in science and engineering. If mathematics truly undergoes revolutionary development, there is every reason for that prosperity to spill over into neighboring fields. Experts in those fields will either become mathematicians, at least in part, so they can understand it, or they will need mathematicians to help them understand it. Mathematicians may have a chance to prosper, though perhaps only after quietly transforming into whatever the new era requires.

Of course, it is also possible that people in other fields who need mathematics will simply collaborate with AI directly. But that would require a level of trust in AI far beyond what we have today, as well as more time.

## Final Thoughts

I have many other thoughts, but I have decided to stop here for now. I think the different combinations you choose reflect different underlying beliefs and lead to different choices. I believe mathematicians need to adapt to a new era, but I do not quite agree with the overly anxious and pessimistic views online. To me, this still feels like a branching point in a game. It will determine whether mathematicians are heading toward dawn or twilight.
