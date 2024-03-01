#  February

casual start with a lighthearted weekend project, this month feels more like a transitional period than a one-project dominated month

#### GLORT2 *(GLORT2 Low Rank Transformer Transformer)*

Is a transformer model where every single linear layer is another smaller transformer model, trained on the deduplicated pile.

| model                                                        | 512-token strided perplexity on a pile test set | tokens         |
| ------------------------------------------------------------ | ----------------------------------------------- | -------------- |
| cerebras 111m                                                | 21.550655364990234                              | 2.2b           |
| cerebras 256m                                                | 15.203496932983398                              | 5.1b           |
| cerebras 590m                                                | 12.098200798034668                              | 11.something b |
| deduped pythia 70m (95.6M)                                   | 22.393400192260742                              | 300b           |
| deduped pythia 160m (213M)                                   | 13.933751106262207                              | 300b           |
| deduped pythia 410m (506M)                                   | 9.61842155456543                                | 300b           |
| llama w same settings as cerebras 111m (119m)                | 13.882301330566406                              | 2.2b           |
| llama plus w same settings as cerebras 111m and llama 70b embeddings (369m) | 13.565109252929688                              | 2.2b           |
| [**GLORT2 (205m)**](https://huggingface.co/crumb/GLORT2)     | 13.051741600036621                              | 2.2b           |

sweet right, takes forever to train though, dont do this, the glort2 model is a d768 model with d384 single-layer transformers instead of linear layers. I know hierarchal transformers exist but I thought this would make it silly. no weight sharing or anything.

---

#### Ask Mistral *(part 1/15)*

I took a shard of the raw deduplicated Pile dataset and did a heavy filtering (taking roughly the top 1/8th) with a custom ask-llm ([“How to Train Data-Efficient LLMs”](https://arxiv.org/abs/2402.09668)) implementation with [mistralai/Mistral-7B-Instruct-v0.2](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2), which took it down to 1.38 billion tokens. Trained some generic ~100m modern transformer decoder models to see how it compares

| data source | arc-c @ 25     | truthfulqa @ 0 | winogrande @ 5 | hellaswag @ 10 | mmlu @ 5       | gsm8k @ 5     | mean           |
| ----------- | -------------- | -------------- | -------------- | -------------- | -------------- | ------------- | -------------- |
| slimpajama  | 21.08±1.19     | 47.54±1.53     | 50.75±1.41     | 27.78±0.45     | 25.10±0.44     | 0±0           | 28.70±0.41     |
| minipile    | 20.90±1.19     | **49.08±1.56** | 50.36±1.41     | 27.30±0.44     | 25.21±0.44     | 0.15±0.11     | **28.83±0.42** |
| ours (1/15) | **22.10±1.21** | 45.71±1.56     | **51.30±1.40** | **27.84±0.45** | **25.25±0.44** | **0.38±0.17** | 28.76±0.42     |

Each of these was trained with the same hyperparameters as [cerebras/Cerebras-GPT-111M](https://huggingface.co/cerebras/Cerebras-GPT-111M), for 2.2GTok, this dataset has ~1.38GTok so 1.59 epochs were used. I was surprised to see that the model trained on the 1-shard filter outperforms the model trained on minipile which is a filter of the entire deduped pile dataset, Mistral is really that smart?

---

#### DPO Can Maybe Get You More Engagement, You Shouldn't Try Though

Playful experiment, not very scientific. I was allowed to use an X (formerly Twitter) account that has around 1k followers and primarily shares humorous "meme" content, to post texts generated with a finetuned Mistral-7b-v0.1 model.

To start, I created a dataset for this task by filtering posts from the tweets.js file in their X (formerly Twitter) archive. I ranked each post based on a scoring system where each `favorite` is worth 1 point and each `repost` is worth 3 points. After tallying up the scores, I selected the top 10% (which ended up being ~4k posts in total) for the first stage of training.

For the second stage, I created a DPO dataset that compares posts made in close succession based on their score. This method helps to avoid awkward normalization that would be necessary if random posts were directly compared due to factors like time of day and day of the week affecting them too much.

Posts were generated from the DPO-tuned model until 8 "good enough to post" posts were created (as determined by the X account's owner, I wasn't going to force them to post anything that would increase the chance of them getting suspended or tarnish their 'brand'). So this is a comparison of the "good enough to post" posts vs the user's posts, as determined by score. Whenever the user posted, they also posted, in quick succession, a random sample from the 8 "good enough to post" generated posts to compare scores to after 48 hours. 

| Win rate | I felt like this needed a table but forgot what else I was gonna put on it |
| :------: | :----------------------------------------------------------: |
|   6/8    | <- Isn't that crazy that it wins over the user 75% of the time here, using only text? Especially at just 7b? |

| Source | "I could post this and nobody would think I'm kidnapped"/Generated posts |
| ------ | :----------------------------------------------------------: |
| SFT    |                             8/80                             |
| DPO    |                             8/38                             |
| Human  |   8/conceivably any number of thoughts throughout the day    |

While finding the good enough SFT posts "felt like mining the library of babel for fun facts," the DPO model's responses were often denied from the "good enough to post" category on the grounds that "they provide very insightful data about what the audience likes to see" (negative). The posts generated by the DPO model did not end up modelling just the most interacted-with posts of the user, but how the user could post if devoted entirely to increasing engagement, it was bad looking stuff in there.

##### End Notes

- This is not very scientific. The sample size is very small and while the user may have had good intentions while choosing the generated posts, any unconscious bias (for example: from seeing the experiment as competitive) may have skewed the results in the favor of the Human. 

- I don't think I will be doing this at a larger scale because it's a pain. This is barely science-adjacent I just wanted to do it and had someone who was a willing ~~victim~~ participant.
- If you try this out on your own posts, looking at the DPO dataset might make you angry or affect your mental state otherwise, plan accordingly.
- This is also usually unethical, I definitely should mention that. Llama etc. have terms about not displaying generated content to people without a label for a reason. That's why we used Mistral. The user's audience also is "chill about this kind of stuff," but that happened through years of cultivation. Yours, on average, probably will not be.

---

#### Ask-Mistral *(part 2/15)*

Tried with the second shard both concatenated to the other shard and with them both put together and filtered for top half to do that 1.59 epochs again, and, here's the result of that i guess . 🙄 

Also, I switched to using the Mistral  HuggingFace Transformers implementation with the same hyperparameters as before because it handles things way better than my code, and I am not really testing any architectural differences here.

Looks competitive with minipile as a filter of 2/15th the text, excited to keep doing this and keep updating when I have time to process more

| data source           | arc-c @ 25     | truthfulqa @ 0   | winogrande @ 5 | hellaswag @ 10  | mmlu @ 5       | gsm8k @ 5     | mean           |
| --------------------- | -------------- | ---------------- | -------------- | --------------- | -------------- | ------------- | -------------- |
| ours (2/15, top half) | **21.50±1.20** | 45.71±1.54       | **51.07±1.40** | **28.01±0.45**  | 25.67±0.44     | 0.99±0.27     | **28.81±0.42** |
| ours (2/15)           | 20.65±1.18     | 45.53±1.54       | 49.72±1.14     | 27.96±0.45      | 24.67±0.44     | 1.44±0.33     | 28.33±0.39     |
| slimpajama            | hf outage      | i couldnt stream | the slimpajama | dataset because | hf is down     | right now     | !!!!!!         |
| minipile              | 20.65±1.18     | **46.33±1.55**   | 50.75±1.41     | 27.46±0.45      | **26.11±0.44** | **1.51±0.31** | 28.80±0.42     |

---

#### That's it?

Yeah, sorry, I have more on the way. I just started a new project [GooberML](https://huggingface.co/goobers) where I'll publish my sillier fully-featured ideas and models, stuff like GLORT-2 but bigger. I have a new augmentation to sampling in the works which will hopefully result in a model being published, and hopefully a paper if I can get myself to start writing like a nerd. I started with an incredibly stupid premise but then realized "this is totally something people would read earnestly and that's makes it even funnier."

![image/png](https://cdn-uploads.huggingface.co/production/uploads/6079949388160e14e4e2e499/g_FK4MSmCakqMWGSy8XnG.png)

#### Annoying

i dont have a job you can support me if you want through crypto (its easiest for me)

`btc on bitc network 3JB6if8iTpWBbBGBdnoYZxpg3CZoLUUvYe`<br>
`eth on eth unified 0x3fad449e20b44308d80ec663cbc2408f8bb68804`<br>
`sol on sol EpxKy2DqsoALJC35BJ3ZPEoqPYqwQmVGC1BpqeT6vJHt`<br>
`xtz tz1ULvqesQA8SnopRzuQKFQj2jdLGBatJoC3`



