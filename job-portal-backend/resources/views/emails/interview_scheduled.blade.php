<!DOCTYPE html>
<html>

<head>
    <title>Interview Scheduled</title>
</head>

<body>
    <h2>Hello {{ $candidateName }},</h2>
    <p>Your interview for the position of <strong>{{ $jobTitle }}</strong> has been scheduled.</p>
    <p><strong>Date:</strong> {{ $interviewDate }}</p>
    <p><strong>Time:</strong> {{ $interviewTime }}</p>

    <p>If you have any questions, you can contact your employer at:
        <a href="mailto:{{ $employerEmail }}">{{ $employerEmail }}</a>
    </p>

    <p>Good luck!</p>
</body>

</html>