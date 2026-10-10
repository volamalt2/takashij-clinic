<?php
require_once 'C:/xampp/htdocs/takashij/wp-load.php';

// Check existing posts
$existing = get_posts([
    'post_type' => 'post',
    'post_status' => 'any',
    'numberposts' => -1
]);

echo "Current WP posts count: " . count($existing) . "\n";
foreach ($existing as $p) {
    echo "- ID: {$p->ID} | Status: {$p->post_status} | Title: {$p->post_title}\n";
}

// Read articles-data.js
$jsContent = file_get_contents(__DIR__ . '/js/articles-data.js');
if (preg_match('/window\.TAKASHIJ_ARTICLES\s*=\s*(\{[\s\S]*?\});?\s*$/', $jsContent, $matches)) {
    $articles = json_decode($matches[1], true);
    if (!$articles) {
        echo "Error parsing JSON from articles-data.js: " . json_last_error_msg() . "\n";
        exit(1);
    }

    echo "\nFound " . count($articles) . " articles in articles-data.js to import.\n";

    // Trash or remove "Hello world!" if present
    foreach ($existing as $p) {
        if ($p->post_name === 'hello-world' || $p->post_title === 'Hello world!') {
            wp_delete_post($p->ID, true);
            echo "Deleted default 'Hello world!' post.\n";
        }
    }

    $admin_user = get_user_by('login', 'admin');
    $author_id = $admin_user ? $admin_user->ID : 1;

    foreach ($articles as $slug => $art) {
        $title = $art['title'] ?? '';
        $content = $art['content'] ?? '';
        $lead = $art['lead'] ?? '';
        $categoryName = $art['categoryName'] ?? 'Tin tức';
        $categorySlug = $art['category'] ?? sanitize_title($categoryName);
        $dateStr = $art['date'] ?? ''; // Format: "12.01.2026"

        // Format post date
        $post_date = current_time('mysql');
        if (preg_match('/^(\d{2})\.(\d{2})\.(\d{4})$/', $dateStr, $dm)) {
            $post_date = "{$dm[3]}-{$dm[2]}-{$dm[1]} 09:00:00";
        }

        // Check if category exists or create it
        $cat_id = 0;
        $term = get_term_by('slug', $categorySlug, 'category');
        if (!$term) {
            $term = get_term_by('name', $categoryName, 'category');
        }
        if (!$term) {
            $term_inserted = wp_insert_term($categoryName, 'category', [
                'slug' => $categorySlug
            ]);
            if (!is_wp_error($term_inserted)) {
                $cat_id = $term_inserted['term_id'];
            }
        } else {
            $cat_id = $term->term_id;
        }

        // Check if post already exists by slug or title
        $existing_post = get_page_by_path($slug, OBJECT, 'post');
        if (!$existing_post) {
            // Find by title
            $search_posts = get_posts([
                'post_type' => 'post',
                'title' => $title,
                'post_status' => 'any',
                'numberposts' => 1
            ]);
            if (!empty($search_posts)) {
                $existing_post = $search_posts[0];
            }
        }

        $post_data = [
            'post_title'    => $title,
            'post_name'     => $slug,
            'post_content'  => $content,
            'post_excerpt'  => $lead,
            'post_status'   => 'publish',
            'post_author'   => $author_id,
            'post_date'     => $post_date,
            'post_category' => $cat_id ? [$cat_id] : [],
        ];

        if ($existing_post) {
            $post_data['ID'] = $existing_post->ID;
            $pid = wp_update_post($post_data);
            echo "Updated post ID: {$pid} ({$slug})\n";
        } else {
            $pid = wp_insert_post($post_data);
            echo "Created post ID: {$pid} ({$slug})\n";
        }

        if (!is_wp_error($pid)) {
            // Store meta
            if (!empty($art['cover'])) {
                update_post_meta($pid, '_takashij_cover', $art['cover']);
            }
            if (!empty($art['author'])) {
                update_post_meta($pid, '_takashij_author', $art['author']);
            }
            if (!empty($art['lead'])) {
                update_post_meta($pid, '_takashij_lead', $art['lead']);
            }
        }
    }

    echo "\nAll articles imported and published successfully!\n";
} else {
    echo "Could not find TAKASHIJ_ARTICLES in articles-data.js\n";
}
