<script>
    import Quiz from './Quiz.svelte';
    import Evaluation from './Evaluation.svelte';

    let isEvaluation = false;
    let userAnswers = []; // Liste der Antworten des Nutzers
    let score = 0;

    function handleFinishQuiz(answers, finalScore) {
        userAnswers = answers;
        score = finalScore;
        isEvaluation = true; // Wechsel zur Auswertung
    }
</script>

<main>
    {#if !isEvaluation}
        <Quiz on:finishQuiz={handleFinishQuiz} />
    {:else}
        <Evaluation {userAnswers} {score} />
    {/if}
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        margin: 2rem;
    }
</style>
