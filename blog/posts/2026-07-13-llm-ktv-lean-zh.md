---
title: "用 LLM 生成证明并完成形式化验证"
date: 2026-07-13
author: Guanyang Wang
lang: zh-CN
description: "GPT-5.5 Pro 如何生成一个解决 1997 年 KTV 猜想二元矩阵情形的证明，以及 LLM 生成加 Lean 验证为何可能成为常见的数学工作范式。"
slug: llm-ktv-lean-zh
toc_title: 目录
back_label: "← 返回 Blog"
alternate_url: llm-ktv-lean.html
alternate_label: English
alternate_lang: en
---

2026 年 6 月，我用 [ChatGPT 5.5 Pro](https://openai.com/index/introducing-gpt-5-5/) 得到了 [Kannan–Tetali–Vempala（KTV）猜想](https://dl.acm.org/doi/10.5555/314161.314256)的一个证明。我和合作者付伟博、秦芊做了仔细的检查，随后用 [Codex](https://openai.com/codex/) 完成了 [Lean](https://lean-lang.org/) 形式化。

这个定理本身就有重要意义。KTV 猜想提出于 1997 年，问的是：对于任意可行的行和与列和，二元矩阵上的 swap chain 是否都能快速混合？其核心是一个基本的采样问题：从所有具有给定行列和的二元矩阵中均匀采样；等价地，从所有具有给定度数的二部图中均匀采样。这个链是生态学、统计学和网络分析中 fixed-margin null models 的标准采样方法。经过近三十年的研究，[我们的定理](https://arxiv.org/abs/2606.22636)最终解决了 KTV 猜想的二元矩阵情形：它对任意可行的 margins 给出了最坏情形下最优的 spectral-gap 下界；事实上，这比原来的 rapid-mixing 猜想本身还要强。

但更让我震撼的，是这个结果产生和被检验的方式。无论在生成证明还是形式化方面，LLM 的表现都远远超过了我的预期。

我毫不怀疑，这会改变数学家的工作方式。我认为，我们的经历指向了一种以后可能会很常见的范式：LLM 生成证明；人负责审查、引导并对结果负责；LLM 再把证明写成 Lean；最后由 Lean 内核检查形式化。随着 LLM 生成的证明越来越多，验证很可能成为瓶颈。把证明生成和机器检查的形式化结合起来，也许能在扩大数学发现规模的同时，为结果提供可信的验证。

因此，我决定把我们得到和检验这个证明的全过程记录下来。我希望尽可能具体地写下这套流程在实践中是怎样完成的，供其他人参考。

生成证明总共只用了几轮 prompt。Codex 写 Lean 花了大约 100 小时，用掉了 GPT Pro 一周的 quota，最初写出了大约 10 万行代码。

## 相关材料

- 论文：[Spectral Gap for the Binary Fixed-Margin Swap Chain](https://arxiv.org/abs/2606.22636)
- Lean 形式化：[guanyangwang/ktv-swap-lean](https://github.com/guanyangwang/ktv-swap-lean)
- Prompt 记录：[Prompt history](https://chatgpt.com/share/6a37fe0d-f98c-83ea-a481-f16f68e47ddb)
- Slides：TBA

这篇记录不讨论具体的数学内容。对证明本身感兴趣的读者，请看我们的[论文](https://arxiv.org/abs/2606.22636)和 Slides。

## 其他相关案例

除了我们的例子，我最近也了解到一些其他研究者的案例，一并整理在这里：

- OpenAI 的内部模型推翻 Erdős unit-distance conjecture：[官方说明](https://openai.com/index/model-disproves-discrete-geometry-conjecture/)、[AI 生成的证明](https://cdn.openai.com/pdf/74c24085-19b0-4534-9c90-465b8e29ad73/unit-distance-proof.pdf)、[数学家的说明文章](https://cdn.openai.com/pdf/74c24085-19b0-4534-9c90-465b8e29ad73/unit-distance-remarks.pdf)、[模型推理记录的节选与重写版](https://cdn.openai.com/pdf/1625eff6-5ac1-40d8-b1db-5d5cf925de8b/unit-distance-cot.pdf)。
- Xiao Ma 用公开版 GPT-5.5 Pro 复现 unit-distance conjecture 的反例构造 [Prompt history](https://chatgpt.com/share/6a0e9e04-8cb0-8332-a4f1-ec68acd2e03e)
- OpenAI 发布了由 GPT-5.6 Sol Ultra 生成的 Cycle Double Cover Conjecture 证明稿：[证明稿](https://cdn.openai.com/pdf/04d1d1e4-bc75-476a-97cf-49055cd98d31/cdc_proof.pdf)、[prompt](https://cdn.openai.com/pdf/04d1d1e4-bc75-476a-97cf-49055cd98d31/cdc_prompt.pdf)、[发布帖](https://x.com/__eknight__/status/2075643450196971805)。
- 北京大学团队提出的 Rethlas–Archon 系统，将自然语言证明搜索与 Lean 形式化结合起来：[论文](https://arxiv.org/abs/2604.03789)、[Rethlas](https://github.com/frenzymath/Rethlas)、[Rethlas 输出](https://github.com/frenzymath/Rethlas_results)。
- Binghui Peng、Hantao Yu、Runzhou Tao、Steven Wang、Diyi Liu 等人使用 GPT-5.5 Pro 的 prover–verifier pipeline 处理一组数学 open problems，并对部分结果完成 Lean 形式化：[pipeline-math 项目](https://github.com/Pengbinghui/pipeline-math)。

## Prompt 的过程

我的 prompt 过程很简单：把问题给模型，让它证明或者证伪。上面那些案例里的 prompt 也许更高端。

唯一值得强调的一点是，GPT-5.5 Pro 首先搜索了这个问题的主流方法，即 P-stability，然后尝试沿着这个方向推进，但没有成功。我对这个方法有一点了解，知道仅沿着这条路线不太可能解决一般情形，于是在中途 prompt 它不要执着于现有方法，而是考虑偏代数的思路。

事实上，这个转方向的 prompt 改变了一切。之后 GPT 基本上是全自动地，在几轮之内给出了证明。很显然，我在给出这个 prompt 时，其实并不知道代数方法会有效——不然我自己就做出来了。我只是看到它卡住了，于是让它试一条新的路线。

所以，这里 human-in-the-loop 的部分，主要就是一次 high-level 的方向性 prompt。这样的引导在这个例子里显然有效，哪怕人自己也不知道新方向具体应该怎么走。

在 [GPT-5.6](https://openai.com/index/gpt-5-6/) 发布之后，也许更合适的方式是在 Codex 里使用 Sol，而不是像我一样在网页里做。Codex 的 [`/goal`](https://developers.openai.com/codex/use-cases/follow-goals) 命令可能会非常有用：它可以让GPT猛猛工作几十个小时。

## 形式化的过程

在和合作者人工验证之后，我尝试让 Codex 形式化这个证明。在此之前，我没有写过 Lean，电脑上也没有安装过 Lean。Codex 在我的其他项目里有巨大帮助，但让它写 Lean，对我最初也只是不抱希望的尝试。

我的做法是先设置 `/goal`，一开始只让它形式化一小部分。后来，它每一轮的表现都远高于我的预期，我就开始让它形式化整篇论文。

形式化整篇论文时也出现了一些问题。遇到数学上标准、但文章里没有给出细节的结论时，Codex 有时会卡住。具体表现是：它反复证明一些相近、重复的定理，而不是真正推进主证明。

这种时候，我的做法是引入 [Claude Code](https://www.anthropic.com/claude-code)（使用 [Sonnet 或 Opus](https://docs.anthropic.com/en/docs/about-claude/models/overview)）来审计代码；在一些我能直接判断的地方，我也会让 GPT 先补充更详细的自然语言证明，再把这些证明交给 Codex。最后，这些问题都解决了。

整个过程结束后，我又让 Codex 做了一次彻底重构，因此最终代码从约 10 万行降到了 7 万至 8 万行。我还额外做了若干轮审计，确认形式化的定理确实与论文的主定理一致。

我估计，整个过程的自动化程度在 95% 左右。我的主要作用，是避免 Codex 陷入重复的等价循环。有点遗憾的是，直到项目结束，我仍然不会写 Lean，虽然已经能看懂一点。

## FAQ

### 1. 为什么要用 Lean 验证？

审查 LLM 生成的证明很有趣，但也让人紧张。它毕竟和自己写出的证明不一样。即使做了多轮检查，我有时还是会担心漏掉细节。

从更长的时间尺度看，LLM 无疑会证明更多、也更重要的定理，但人们很难完全消除对证明可能出错的担心。因此，给同行提供一个正确的证明，我觉得是我们作为较早vibe-mathing的人应该负的责任。

Lean 不是唯一的验证方式，尤其是它在很多数学方向上的库还不成熟；但它无疑是一个很好的办法。它让我们可以把更多精力从“担心证明是否正确”转移到理解数学本身。

### 2. LLM 能做多少数学猜想？

我怀疑可以做很多。

按照我目前的理解，LLM 大概可以完成这样的工作：

> 几乎所有 ingredients 都已经存在，但此前没有人看到完整的全局证明。

我觉得，它目前还不能完成那些需要建立一整套新理论体系的工作。但它可以完成复杂计算，提供巧妙思路，并组合来自不同领域的技巧。

你自己的领域里，哪些问题属于这个难度层级？

### 3. 尝试了多少次才做出来？

这是我用 prompt 尝试的第一个数学猜想。

我五月才充值 Pro。我主要用 Codex 做扩散模型相关的研究。实际上，我这几年已经逐渐远离理论，所以这绝对不是“尝试了几百个问题，成功了一个”的例子。

当然，做出这个问题之后，我也尝试了几个其他问题。其中一些并不是公开猜想，只是我自己感兴趣的问题。结果比较 mixed。

### 4. 对数学的影响？

短期内，我们会见证一个“prompt era”：会出现很多新进展和新证明，验证可能随之成为瓶颈。

好的一面是，会有很多重要的新结果产生。另一面是，“中等结果”的价值可能会被 LLM 大幅压缩。这可能同样适用于学习理论、理论统计、计量经济学和理论物理等理论领域。

### 5. 对数学家的影响？

我不知道。

这次体验对我——一个有数学背景、但已经逐渐转向其他领域的人——可以说很完美。它给了我一个借口，让我可以在闲暇时偶尔问问模型，聊聊当年感兴趣、却苦思不得的问题。

对完全以数学为职业的人，我觉得感受会复杂得多。一个人努力多年的问题，可能会在很短时间内被模型解决。

不过，也可以有一种更积极的理解：LLM 也许会让擅长解决具体问题的数学家挑战更困难的问题；而理论构建者则可以用另一种方式与模型合作——用自己的数学品味和高层判断，引导新理论的构建。

### 6. 这次经历带给我什么结论？

这次经历让我有了三个很直接的结论。

第一，LLM 现在已经非常强大。我毫不怀疑，它们会改变人们做数学的方式。

第二，用 Lean 验证远比我想象的容易：借助 LLM，你甚至不需要会 Lean，也能得到机器检查的形式化证明。生成的代码远达不到 mathlib 标准，但足以检验定理是否 *merely true*。不过这个例子可能有偏差，因为 Lean 对许多领域的支持仍不完善。

第三，我的建议很简单：大胆测试，严谨验证。中国有句话常被用来讽刺：“人有多大胆，地有多大产。”但面对今天的模型，它也许意外地有几分道理。可以让模型尝试那些过去不敢做的问题。每一次尝试也都是一次测试：观察它能做到什么、会在哪里失败，以及哪些地方仍然离不开人的品味和判断。我们正是这样逐渐摸清这些系统的能力边界。

*我继续研究扩散模型去了。祝大家 prompt 愉快！如果模型带来惊喜，可以考虑请我喝杯咖啡。☕*
