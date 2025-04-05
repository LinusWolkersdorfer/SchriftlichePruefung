<script>
    import { onMount } from 'svelte';

    let questions = [];
    let currentQuestionIndex = 0;
    let selectedOption = null;
    let answers = [];
    let score = 0;

    const fetchQuestions = async () => {
        const response = await fetch('http://localhost:5000/api/questions');
        questions = await response.json();
    };

    function handleAnswer() {
        answers.push({
            id: questions[currentQuestionIndex].id,
            selectedOption
        });

        // Punktestand aktualisieren
        if (selectedOption === questions[currentQuestionIndex].correctOption) {
            score++;
        }

        // Nächste Frage oder Quiz beenden
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            selectedOption = null;
        } else {
            finishQuiz();
        }
    }

    function finishQuiz() {
        const event = new CustomEvent('finishQuiz', {
            detail: { answers, score }
        });
        dispatchEvent(event);
    }

    onMount(() => {
        fetchQuestions();
    });
</script>

{#if questions.length > 0}
    <h2>{questions[currentQuestionIndex].question}</h2>
    <p>Kategorie: {questions[currentQuestionIndex].category}</p>

    <div>
        <button on:click={() => selectedOption = 1}>{questions[currentQuestionIndex].option1}</button>
        <button on:click={() => selectedOption = 2}>{questions[currentQuestionIndex].option2}</button>
        <button on:click={() => selectedOption = 3}>{questions[currentQuestionIndex].option3}</button>
    </div>

    {#if selectedOption}
        <button on:click={handleAnswer}>Weiter</button>
    {/if}
{:else}
    <p>Fragen werden geladen...</p>
{/if}
