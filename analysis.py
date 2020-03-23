import string
from wordcloud import WordCloud, STOPWORDS
import matplotlib.pyplot as plt

inFile = open("vibes.txt", "r")
text = inFile.read()

# remove punctuation
text = "".join([char for char in text if char not in string.punctuation])

# remove digits
text = "".join([char for char in text if char not in "0123456789"])

# make a list of words from the text string
text = text.replace("\n", " ")
words = text.split(" ")

# remove empty strings
words = list(filter(None, words))

# make everything lowercase
words = [word.lower() for word in words]

# remove stopwords
stop_words = list(STOPWORDS) + ["us", "pretty", "we’re", "one", "kinda", "lot"]
words = [word for word in words if word not in stop_words]

'''
outFile = open("vibes_words.txt", "w")
for word in words:
  outFile.write(word + " ")
'''

# create frequency dictionary
frequencies = {}
for word in words:
  if word in frequencies:
    frequencies[word] += 1
  else:
    frequencies[word] = 1

# get most frequent words
ordered_freqs = {k: v for k, v in sorted(frequencies.items(), key=lambda item: item[1], reverse=True)}
most_frequent = {k: v for k, v in ordered_freqs.items() if v > 8}

# wordcloud of most frequent words
freq_words_string = " ".join(most_frequent)
wordcloud = WordCloud().generate(freq_words_string)
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.savefig("wordcloud.png")
plt.close()

# bar graph of most frequent words
plt.style.use("seaborn")
plt.barh(list(most_frequent.keys()), most_frequent.values(), height = 0.75)
plt.gca().invert_yaxis()
plt.title("Most Common Words Used to Self-Describe Friend Groups")
plt.xlabel("Word")
plt.ylabel("Frequency")
plt.savefig("bar_graph.png")